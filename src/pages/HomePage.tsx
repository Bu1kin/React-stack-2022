import React, {useEffect, useState} from 'react';
import {githubApi} from "../rtk/query-services/github.api";
import {useDebounce} from "../hooks/debounce";
import {RepoCard} from "../components/RepoCard";

const HomePage = () => {
    const [search, setSearch] = useState('')
    const [dropdown, setDropdown] = useState(false)
    const debounced = useDebounce(search)
    const {isLoading, isError, data} = githubApi.useFetchFoundedUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true
    })
    const [fetchRepos, {isLoading: areReposLoading, data: repos}] = githubApi.useLazyGetUserReposQuery()

    useEffect(() => {
        setDropdown(debounced.length > 3 && data?.length! > 0)
    }, [debounced, data])

    const clickHandler = (username: string) => {
        fetchRepos(username)
        setDropdown(false)
    }

    return (
        <div className={"flex justify-center pt-10 mx-auto h-screen w-screen"}>
            {isError && <p className={"text-red-600 text-center"}>Увы... :(</p>}

            <div className={"relative w-[560px]"}>
                <input
                    type={"text"}
                    className={"border py-2 px-4 w-full h-[42px] mb-2"}
                    placeholder={"Поиск имени пользователя Github..."}
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />

                {dropdown && <ul className={"list-none absolute top-[42px] left-0 right-0 max-h-[200px] shadow-md bg-white overflow-y-scroll"}>
                    {isLoading && <p className={"text-center"}>Загрузка...</p>}
                    {data?.map(user => (
                        <li
                            onClick={() => clickHandler(user.login)}
                            key={user.id}
                            className={"py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"}
                        >
                            {user.login}
                        </li>
                    ))}
                </ul>}

                <div className={"container"}>
                    {areReposLoading && <p className={"text-center"}>Загрузка...</p>}
                    {repos?.map(repo => <RepoCard key={repo.id} repo={repo}/>)}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
