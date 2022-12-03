import logo from '../img/logo.png';
import { Button, Stack } from '@mui/material/';

export default function SplashScreen() {

    return (
        <div id="splash-screen">
            <img src={logo} width={140} height={46}/>
            <h1 style={{fontSize: "48pt"}}>Welcome to Playlister</h1>
            <p style={{fontSize: "24pt"}}>A place to create and share your favorite playlists.</p>

            <Stack direction="column" alignItems="center" justifyContent={"center"}>
                <Button variant="contained" href='/login/' sx={{width: 200, margin: 1}}>Login</Button>
                <Button variant="contained" href='/register/' sx={{width: 200, margin: 1}}>Create Account</Button>
                <Button variant="contained" href='/login/' sx={{width: 200, margin: 1}}>Continue as Guest</Button>
            </Stack>

            <p>Developed by Kerrance Dai</p>
        </div>
    )
}