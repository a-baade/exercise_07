import React, {useState} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {fetchJSON, postJSON, useLoading} from "./http";

function FrontPage() {
    return (
        <div>
            <h1>Movie DataBase</h1>
            <ul>
                <li>
                    <Link to = {"/movies"}>List Movies</Link>
                </li>
                <li>
                    <Link to = {"/movies/new"}>Add new Movie</Link>
                </li>
            </ul>
        </div>
    );
}

function MovieView({
    movie: {countries, directors, fullplot, poster, title, year}}) {
    return (
        <div>
            <h2>
                {title} ({year})
            </h2>
            <div>
                <strong>Directed by {directors.join(", ")}</strong>
            </div>
            <img src ={poster} alt = "Movie Poster" width={100} />
            <div>
                {fullplot} (countries: {countries.join(",")})
            </div>
        </div>
    );
}

function ListMovies() {
    const {loading, error, data} = useLoading(async () => await fetchJSON("/api/movies"));

    if (loading) {
        return <div>Loading....</div>;
    }
    if (error) {
        return <div>Error: {error.toString()}</div>
    }

    return <div>
        <h1>Movies</h1>
        {data.map(movie => <MovieView key={movie.title} movie = {movie} />)}
    </div>;
}


function FormInput({label, value, setValue}) {
    return (
        <div>
            <div>
                <label>{label}</label>
            </div>
            <div>
                <input value={value} onChange={(e) => setValue(e.target.value)}/>
            </div>
        </div>
    );
}

function FormTextArea({label, value, setValue}) {
    return (
        <div>
            <div>
                <label>{label}</label>
            </div>
            <div>
                <textarea value={value} onChange={(e) => setValue(e.target.value)}/>
            </div>
        </div>
    );
}

function AddNewMovie() {
    const [title, setTitle] = useState("");
    const [year, setYear] = useState("");
    const [director, setDirector] = useState("");
    const [fullplot, setFullplot] = useState("");
    const [country, setCountry] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        await postJSON("/api/movies", {
            title,
            year: parseInt(year),
            directors: [director],
            fullplot,
            countries: [country],
        });
        setTitle("");
        setYear("");
        setDirector("");
        setFullplot("");
        setCountry("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add new movie to DB</h2>
            <FormInput label={"Title"} value={title} setValue={setTitle} />
            <FormInput label={"Year"} value={year} setValue={setYear} />
            <FormInput label={"Director"} value={director} setValue={setDirector} />
            <FormInput label={"Country"} value={country} setValue={setCountry} />
            <FormTextArea
                label={"Full plot"}
                value={fullplot}
                setValue={setFullplot}
            />
            <div>
                <button disabled={title.length === 0 || year.length === 0}>Save</button>
            </div>
        </form>
    );
}

function Application() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path = {"/"} element = {<FrontPage/>} />
                <Route path = {"/movies"} element = {<ListMovies/>} />
                <Route path = {"/movies/new"} element = {<AddNewMovie/>} />
            </Routes>
        </BrowserRouter>
    ) ;
}

ReactDOM.render(<Application/>, document.getElementById("app"));