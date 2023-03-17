import React, { useCallback } from 'react';
import { DropdownItem, DropdownItemProps } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { History } from 'history';


interface ToProps {
    pathname: History.Path;
    state?: History.LocationState;
}
interface DropdownItemLinkProps extends DropdownItemProps {
    to?: string | ToProps;
}

const DropdownItemLink: React.FC<DropdownItemLinkProps> = ({ to, onClick, ...rest }) => {
    const history = useHistory();

    const handleClick: React.MouseEventHandler<any> = useCallback((event) => {
        if (to) {
            if (typeof to === 'string') {
                history.push(to);
            } else {
                history.push(to.pathname, to.state);
            }

        }
        onClick?.call({}, event);
    }, [history, to, onClick]);

    return <DropdownItem {...rest} onClick={handleClick} />

}

export default DropdownItemLink;