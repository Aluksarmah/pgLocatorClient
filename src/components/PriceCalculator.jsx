function PriceCalculator({ price, checkIn, checkOut }) {
    return (
        <>
            <div
                className="mt-5 grid grid-cols-[2fr_1fr] grid-rows-3 border-b-2 pb-3"
            >
                <p className="my-2">price</p>
                <p className="my-2">{`₹${price}`}</p>   
                <p className="my-2">PgLocator service fee</p>
                <p className="my-2">₹10</p>
            </div>
            <div
                className="mt-5 grid grid-cols-[2fr_1fr] grid-row-1"
            >
                <p className="my-2 font-semibold">Total before taxes</p>
                <p className="my-2 font-semibold">₹{(price +10)}</p>
            </div>
        </>
    )
}

export default PriceCalculator