import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ToastMessage({ message, severity = "success", onClose = () => { }, messageId }) {
    const [open, setOpen] = React.useState(false);

    const handleClose = (event, reason) => {
        setOpen(false);
        onClose(event, reason);
    };

    React.useEffect(() => {
        if (!message) {
            return;
        }
        setOpen(true);
    }, [messageId]);

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
