import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ResponseUploadGpx } from '../common/upload-gpx.response';

interface UploadMapProps {
    setMap: React.Dispatch<React.SetStateAction<ResponseUploadGpx | null>>;
    currentMap: ResponseUploadGpx | null;
}

const UploadMap: React.FC<UploadMapProps> = (props) => (
    <Container maxWidth="sm">
        <Box my={4}>
            {/* <Typography variant="h4" component="h1" gutterBottom>
                    Next.js example
                </Typography> */}
            <Grid container spacing={5} alignItems="flex-end">
                <Button variant="contained" component="label" color="primary">
                    Upload File
                    <input
                        accept=".gpx"
                        type="file"
                        hidden
                        onChangeCapture={(e) => handleOnChange(e, props)}
                    />
                </Button>
                <Button
                    variant="contained"
                    component="label"
                    color="secondary"
                    onClick={onSaveMap}
                    disabled={props.currentMap == null}
                >
                    Save
                </Button>
            </Grid>
        </Box>
    </Container>
);
export default UploadMap;

async function handleOnChange(event: React.FormEvent<HTMLInputElement>, props: UploadMapProps) {
    const { files } = event.target as HTMLInputElement;

    if (!files) {
        return;
    }

    const response = await fetch('/api/upload-gpx', {
        method: 'POST',
        body: files[0],
        headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
            'Content-Type': files[0].type,
        },
    });

    const result: ResponseUploadGpx = await response.json();

    props.setMap(result);
}

function onSaveMap() {}
