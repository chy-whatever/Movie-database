import MoviesDisplay from "./MoviesDisplay";

const MainPage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="mt-0 text-5xl font-medium leading-tight text-primary">Movies</h1>
            <MoviesDisplay />
        </div>
    );
};

export default MainPage;
