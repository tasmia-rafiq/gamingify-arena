const AppLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-primary-variant"></div>
        <div className="absolute w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default AppLoader;