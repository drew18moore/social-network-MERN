const Skeleton = ({ circle, width, style }: any) => {
  const styles = {
    ...style,
    width,
    ...(circle && { height: width }),
  };

  return (
    <span className={`${circle ? "circle" : "skeleton"}`} style={styles}></span>
  );
};

export const PostSkeleton = () => {
  return (
    <div className="post-skeleton-bg">
      <div className="skeleton-row">
        <Skeleton circle width={"3rem"} />
        <div className="skeleton-col">
          <Skeleton width={"12rem"} style={{ marginTop: "0.5rem" }} />
          <Skeleton width={"8rem"} />
        </div>
      </div>
      <hr />
      <div className="skeleton-row skeleton-post-btns">
        <Skeleton circle width={"2.25rem"} />
        <Skeleton circle width={"2.25rem"} />
        <Skeleton circle width={"2.25rem"} />
      </div>
    </div>
  );
};

export const UserSkeleton = () => {
  return (
    <div className="user-skeleton-bg">
      <div className="skeleton-row">
        <Skeleton circle width={"3rem"} />
        <div className="skeleton-grid">
          <Skeleton width={"8rem"} />
          <Skeleton width={"5rem"} />
        </div>
      </div>
    </div>
  );
};
