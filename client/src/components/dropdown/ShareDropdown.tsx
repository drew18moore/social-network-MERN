import { BiCopy } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { MdOutlineContentCopy } from "react-icons/md";

type Props = {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>
  postId: string
  authorUsername: string
}
const ShareDropdown = ({ setShowDropdown, postId, authorUsername }: Props) => {
  const { theme } = useTheme();
  
  const extractRootUrl = (url: string) => {
    const regex = /^(https?:\/\/[^\/]+)/;
    const matches = url.match(regex);
    if (matches && matches.length > 1) {
      const rootUrl = matches[1];
      return rootUrl
    }
  };

  const rootURL = extractRootUrl(window.location.href)
  const textToCopy = `${rootURL}/#/${authorUsername}/posts/${postId}`;

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
        <MdOutlineContentCopy />
        <p>Copy link to post</p>
      </li>
    </ul>
  );
};
export default ShareDropdown;
