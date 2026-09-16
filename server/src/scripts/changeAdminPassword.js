import bcrypt from "bcrypt";
import readline from "node:readline";
import { createInterface } from "node:readline/promises";
import pool from "../db/index.js";

async function promptForEmail() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return await rl.question("Email: ");
  } finally {
    rl.close();
  }
}

function promptForHiddenPassword(message) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error("Password prompt requires an interactive terminal."));
      return;
    }

    let password = "";
    const wasRaw = process.stdin.isRaw;

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdout.write(message);

    function cleanup() {
      process.stdin.off("keypress", handleKeypress);
      process.stdin.setRawMode(wasRaw);
      process.stdin.pause();
    }

    function handleKeypress(character, key) {
      if (key?.ctrl && key.name === "c") {
        cleanup();
        process.stdout.write("\n");

        reject(new Error("Password change cancelled."));
        return;
      }

      if (key?.name === "return" || key?.name === "enter") {
        cleanup();
        process.stdout.write("\n");

        resolve(password);
        return;
      }

      if (key?.name === "backspace") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }

        return;
      }

      if (character && !key?.ctrl && !key?.meta) {
        password += character;
        process.stdout.write("*");
      }
    }

    process.stdin.on("keypress", handleKeypress);
  });
}

try {
  const email = await promptForEmail();
  const newPassword = await promptForHiddenPassword("New password: ");

  if (!email.trim() || !newPassword) {
    throw new Error("Email and new password are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const result = await pool.query(
    `
      UPDATE users
      SET
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE email = $2
      RETURNING
        id,
        email,
        role,
        is_active,
        updated_at;
    `,
    [passwordHash, normalizedEmail],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found.");
  }

  console.log("Password updated successfully:");
  console.log(user);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
