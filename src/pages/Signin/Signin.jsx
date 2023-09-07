import React, { useContext, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import Copyright from "../../components/Copyright/Copyright";
import Swal from "sweetalert2";


export const Signin = ({ Context }) => {
    const { fetchToken } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true)

        try {
            const data = new FormData(event.currentTarget);
            const username = data.get('username')
            const password = data.get('password')

            const loginUser = await fetchToken(username, password)

            loginUser == 200
                ?
                navigate("/")
                :
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    html: '<p>User with provided details does not exist</p>',
                    showConfirmButton: false,
                    timer: 3000
                })
        }
        catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                html: `<p>${error}</p>`,
                showConfirmButton: false,
                timer: 3000
            })
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    };

    return (
        <div style={{ backgroundColor: "#1976D2", minHeight: "100vh" }}>
            <div className="d-md-flex flex-md-row justify-content-md-around align-items-center min-vh-100">
                <div className="d-flex justify-content-center align-items-center py-3">
                    <span className="bg-light p-3 rounded-circle"></span>
                    <strong className="text-center text-light fs-3 ms-2">finuncle</strong>
                </div>
                <div className="bg-light p-5 rounded" style={{maxWidth: "35rem"}}>
                    <div className="d-flex">
                        <div className="py-5 b-light"></div>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography component="h5" variant="h5" marginBottom={3}>
                                Log in or Sign up
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <TextField
                                    autoComplete="username"
                                    name="username"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                >
                                    Continue
                                </Button>

                                <p className="text-center">or</p>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                >
                                    continue with facebook
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                >
                                    continue with google
                                </Button>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                >
                                    continue with apple
                                </Button>
                            </Box>
                        </Box>
                    </div>
                    <Copyright sx={{ mt: 8, mb: 4 }} />
                </div>
            </div>
        </div>
    )
}

export default Signin;