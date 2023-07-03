import { BiCopy } from "react-icons/bi";

const ShareDropdown = ({ setShowDropdown }) => {
  return (
    <ul className="share-dropdown">
      <li onClick={(e) => {
        e.stopPropagation();
        setShowDropdown(prev => !prev);
      }}>
        <BiCopy />
        <p>Copy link to post</p> 
      </li>
    </ul>
  )
}
export default ShareDropdown