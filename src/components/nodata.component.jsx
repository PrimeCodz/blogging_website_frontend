const NoDataMessage = ({ message }) => {
    return (
        <>
            <div className="text-center w-full p-4 mt-4 rounded-full bg-grey/50">
                <p>{message}</p>
            </div>
        </>
    );
}

export default NoDataMessage;