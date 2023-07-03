import { BiCopy } from "react-icons/bi";

const ShareDropdown = ({ setShowDropdown, postId, authorUsername }) => {
  const textToCopy = `${window.location.href}${authorUsername}/posts/${postId}`;
  return (
    <ul className="share-dropdown">
      <li onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(textToCopy);
        setShowDropdown(prev => !prev);
      }}>
        <BiCopy />
        <p>Copy link to post</p> 
      </li>
    </ul>
  )
}
export default ShareDropdown