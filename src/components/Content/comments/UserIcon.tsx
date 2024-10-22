interface T {
  userPhoto: string;
  userName: string;
}

const userIconStyle: React.CSSProperties = {
  marginRight: "15px",
  gridColumnEnd: 1,
  gridRowStart: 1,
  gridRowEnd: 3,
};

const iconImageStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
};

const UserIcon = ({ userPhoto, userName }: T) => {
  return (
    <div style={userIconStyle}>
      {userPhoto.length !== 0 && (
        <img src={`${userPhoto}`} alt="userPhoto" style={iconImageStyle} />
      )}
      {userPhoto.length === 0 && userName.length !== 0 && (
        <span>{userName[0].toUpperCase()}</span>
      )}
    </div>
  );
};

export default UserIcon;
