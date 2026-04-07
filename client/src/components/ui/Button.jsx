import "../../styles/components/button.css";

function Button({ text, variant = "primary" }) {
  return <button className={`button ${variant}`}>{text}</button>;
}

export default Button;
