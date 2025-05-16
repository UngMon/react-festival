interface T {
  user_photo: string;
  user_name: string;
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

const UserIcon = ({ user_photo, user_name }: T) => {
  return (
    <div style={userIconStyle}>
      {user_photo !== "" && (
        <img src={user_photo} alt="userPhoto" style={iconImageStyle} />
      )}
      {user_photo === "" && user_name.length !== 0 && (
        <span>{user_photo[0].toUpperCase()}</span>
      )}
    </div>
  );
};

export default UserIcon;
