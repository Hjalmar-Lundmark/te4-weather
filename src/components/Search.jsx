function Search(props) {
    return (
        <>
            <div className="search">
                <input type="text" placeholder='Search' id="search" aria-label="Search" />
                <button onClick={() => { props.getPlace() }} >Update</button>
                {props.search ? (
                    <button onClick={() => { props.setSearch(false) }} >Get my location</button>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default Search