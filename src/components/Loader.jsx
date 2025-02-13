const Loader = () => {
  return (
    <div className="flex flex-col space-y-2 w-[60%]">
      <div className="w-full h-6 bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200 bg-[length:200%_100%] animate-placeholder rounded"></div>

      <div className="w-full h-6 bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200 bg-[length:200%_100%] animate-placeholder rounded"></div>

      <div className="w-1/2 h-6 bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200 bg-[length:200%_100%] animate-placeholder rounded"></div>
    </div>
  );
};

export default Loader;
