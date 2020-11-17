import React from 'react';
import {withRouter} from 'react-router-dom';

const Header = ({history}) => {
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        history.push('/signin')
    }

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default withRouter(Header);