function Search(props) {
    return (
        <>
            <div className="search">
                <input type="text" placeholder='Search' id="search" />
                <button onClick={() => { props.getPlace() }} >Update</button>
            </div>
        </>
    )
}

export default Search