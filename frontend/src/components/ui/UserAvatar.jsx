const UserAvatar = ({ user, className }) => {
    const firstLetter = user?.username?.charAt(0).toUpperCase();
  return (
    // show user avatar if available, else show first letter of username
    <div className={`rounded-full bg-primary text-bg font-semibold flex items-center justify-center ${className}`}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className="w-full h-full object-cover rounded-full" />
        ) : (
          firstLetter || "U"
        )}
    </div>
  )
}

export default UserAvatar