import {AppBar, Toolbar} from '@mui/material';
import {Link} from 'react-router-dom';
import {HeaderButton} from './styled';

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <HeaderButton color="inherit" component={Link} to="/">
                    Home
                </HeaderButton>
                <HeaderButton color="inherit" component={Link} to="/expenses">
                    Expenses
                </HeaderButton>
                <HeaderButton color="inherit" component={Link} to="/balance_sheet">
                    Balance Sheet
                </HeaderButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
