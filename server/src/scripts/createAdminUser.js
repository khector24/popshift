import bcrypt from "bcrypt";
import readline from "node:readline";
import { createInterface } from "node:readline/promises";
import pool from "../db/index.js";

/*
 * Ask the user for their email address in the terminal.
 *
 * createInterface() connects Node to:
 *   process.stdin  -> what the user types
 *   process.stdout -> what Node prints to the terminal
 *
 * Unlike the password, the email does NOT need to be hidden.
 */
async function promptForEmail() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Wait for the user to type their email and press Enter.
    return await rl.question("Email: ");
  } finally {
    // Always close the readline interface when we're finished with it.
    rl.close();
  }
}

/*
 * Ask for a password WITHOUT displaying the real characters.
 *
 * Normal readline input would show the password as it is typed.
 * For a password, we instead listen to individual keyboard presses
 * and print "*" rather than the actual character.
 *
 * This function returns a Promise because it has to wait for the
 * user to finish typing and press Enter.
 */
function promptForHiddenPassword(message) {
  return new Promise((resolve, reject) => {
    /*
     * TTY means we're running inside an interactive terminal.
     *
     * We need an interactive terminal because this function listens
     * directly for keyboard presses.
     */
    if (!process.stdin.isTTY) {
      reject(new Error("Password prompt requires an interactive terminal."));
      return;
    }

    // This variable temporarily holds the actual password in memory.
    let password = "";

    /*
     * Remember whether raw mode was already enabled.
     *
     * Raw mode lets us receive individual keypresses immediately
     * instead of waiting for the user to press Enter.
     */
    const wasRaw = process.stdin.isRaw;

    // Tell Node to start emitting "keypress" events from stdin.
    readline.emitKeypressEvents(process.stdin);

    // Turn on raw mode so we can process each key individually.
    process.stdin.setRawMode(true);

    // Make sure stdin is actively listening for input.
    process.stdin.resume();

    // Print "Password: " to the terminal.
    process.stdout.write(message);

    /*
     * Restore the terminal after we're finished.
     *
     * This is important because we don't want to leave the user's
     * terminal stuck in raw keyboard-input mode.
     */
    function cleanup() {
      process.stdin.off("keypress", handleKeypress);
      process.stdin.setRawMode(wasRaw);
      process.stdin.pause();
    }

    /*
     * This function runs every time the user presses a key.
     *
     * character = the actual character typed, such as "a"
     * key       = information about special keys such as Enter,
     *             Backspace, Ctrl+C, etc.
     */
    function handleKeypress(character, key) {
      /*
       * Ctrl+C means the user wants to cancel.
       */
      if (key?.ctrl && key.name === "c") {
        cleanup();
        process.stdout.write("\n");

        reject(new Error("Admin creation cancelled."));
        return;
      }

      /*
       * Enter means the password is finished.
       *
       * resolve(password) completes the Promise and gives the
       * collected password back to the caller.
       */
      if (key?.name === "return" || key?.name === "enter") {
        cleanup();
        process.stdout.write("\n");

        resolve(password);
        return;
      }

      /*
       * Handle Backspace.
       *
       * Remove the final character from the real password and also
       * erase one "*" from the terminal.
       */
      if (key?.name === "backspace") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }

        return;
      }

      /*
       * Normal character:
       *
       * 1. Add the REAL character to our password variable.
       * 2. Print "*" instead of showing that character.
       *
       * So typing:
       *     hello
       *
       * displays:
       *     *****
       */
      if (character && !key?.ctrl && !key?.meta) {
        password += character;
        process.stdout.write("*");
      }
    }

    // Run handleKeypress() whenever the user presses a key.
    process.stdin.on("keypress", handleKeypress);
  });
}

try {
  /*
   * Get the credentials interactively.
   *
   * We are NO LONGER doing:
   *
   * const [, , email, password] = process.argv;
   *
   * Therefore the password does not need to appear in the command
   * that we type into the shell.
   */
  const email = await promptForEmail();
  const password = await promptForHiddenPassword("Password: ");

  // Both values are required.
  if (!email.trim() || !password) {
    throw new Error("Email and password are required.");
  }

  /*
   * Normalize the email before storing it.
   *
   * Example:
   *   "  Kenny@Example.COM  "
   *
   * becomes:
   *   "kenny@example.com"
   */
  const normalizedEmail = email.trim().toLowerCase();

  /*
   * Hash the plaintext password with bcrypt.
   *
   * 12 is the bcrypt cost/work factor.
   *
   * bcrypt generates a random salt for us and produces the
   * password hash that we will store in PostgreSQL.
   *
   * We NEVER insert the plaintext password into the database.
   */
  const passwordHash = await bcrypt.hash(password, 12);

  /*
   * Create the admin user.
   *
   * $1 = normalizedEmail
   * $2 = passwordHash
   *
   * Parameterized queries keep those values separate from the SQL
   * itself rather than building them directly into the SQL string.
   */
  const result = await pool.query(
    `
      INSERT INTO users (
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, 'admin')
      RETURNING
        id,
        email,
        role,
        is_active,
        created_at;
    `,
    [normalizedEmail, passwordHash],
  );

  /*
   * RETURNING gives us the newly created row.
   *
   * Notice that we intentionally did NOT return password_hash.
   */
  console.log("Admin user created:");
  console.log(result.rows[0]);
} catch (error) {
  /*
   * PostgreSQL error code 23505 means a UNIQUE constraint
   * was violated.
   *
   * Since users.email is UNIQUE, this happens if we try to
   * create another user with the same email.
   */
  if (error.code === "23505") {
    console.error("A user with that email already exists.");
  } else {
    console.error(error.message);
  }

  // Mark the Node process as unsuccessful.
  process.exitCode = 1;
} finally {
  /*
   * Close our PostgreSQL connection pool whether the operation
   * succeeded or failed.
   *
   * Otherwise this one-off script could remain running because
   * the database connection is still open.
   */
  await pool.end();
}
