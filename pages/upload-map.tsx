import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

export default function UploadMap() {
    return (
        <Container maxWidth="sm">
            <Box my={4}>
                {/* <Typography variant="h4" component="h1" gutterBottom>
                    Next.js example
                </Typography> */}
                <Button variant="contained" component="label">
                    Upload File
                    <input accept=".gpx" type="file" hidden onChangeCapture={handleOnChange} />
                </Button>
            </Box>
        </Container>
    );
}

function handleOnChange(event: React.FormEvent<HTMLInputElement>) {
    const { files } = event.target as HTMLInputElement;

    if (!files) {
        return;
    }

    console.log('send', files[0]);

    fetch('/api/upload-gpx', {
        method: 'POST',
        body: files[0],
        headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
            'Content-Type': files[0].type,
        },
    });
}
