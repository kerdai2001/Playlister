import logo from '../img/logo.png';
import { Stack, Button } from '@mui/material/';

export default function SplashScreen() {

    return (
        <div id="splash-screen">
            <img src={logo} width={140} height={46}/>
            <h1 style={{fontSize: "48pt"}}>Welcome to Playlister</h1>
            <p style={{fontSize: "24pt"}}>A place to create and share your favorite playlists.</p>
            <p style={{marginTop: 150}}>Developed by Kerrance Dai</p>
        </div>
    )
}