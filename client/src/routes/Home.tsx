import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AuthStateChanged, signInWithGoogle } from '../utils/auth-util';

export async function homeAction() {
    return 'sandeep';
}

export async function homeLoader() {
    return Promise.resolve('Navin');

}

export default function Home(): JSX.Element {
    const name = useLoaderData();
    useEffect(() => {
        AuthStateChanged(auth => {
            if (auth) {

            } else {
                signInWithGoogle();
            }
        });
    }, []);
    return <div>
        {name}
        <div id="detail">
            <Outlet />
        </div>
    </div>
}