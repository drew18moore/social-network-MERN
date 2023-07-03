import { BiCopy } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";

const ShareDropdown = ({ setShowDropdown, postId, authorUsername }) => {
  const { theme } = useTheme();
  const textToCopy = `${window.location.href}${authorUsername}/posts/${postId}`;
  return (
    <ul className="share-dropdown">
      <li
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(textToCopy);
          setShowDropdown((prev) => !prev);
          toast.success("Copied to clipboard", {
            style: {
              backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
              color: `${theme === "light" ? "" : "#fff"}`,
            },
          });
        }}
      >
        <BiCopy />
        <p>Copy link to post</p>
      </li>
    </ul>
  );
};
export default ShareDropdown;
