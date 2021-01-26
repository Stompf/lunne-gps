import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Input, Typography } from '@material-ui/core';
import { ResponseUploadGpx } from '../common/upload-gpx.response';

interface UploadMapProps {
    setMap: React.Dispatch<React.SetStateAction<ResponseUploadGpx | null>>;
    currentMap: ResponseUploadGpx | null;
}

const UploadMap: React.FC<UploadMapProps> = (props) => {
    const [fileName, setFileName] = useState<string>('');

    const handleOnChange = async (event: React.FormEvent<HTMLInputElement>) => {
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

        setFileName(files[0].name);
        props.setMap(result);
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Button variant="contained" component="label" color="primary">
                    Upload File
                    <input accept=".gpx" type="file" hidden onChangeCapture={handleOnChange} />
                </Button>
                <Box my={4}>
                    <Typography variant="body1" component="p" gutterBottom>
                        {fileName}
                    </Typography>
                </Box>
                <Box my={4} hidden={props.currentMap == null}>
                    <Input placeholder="Prefix (optional)" />
                    <Button
                        variant="contained"
                        component="label"
                        color="secondary"
                        onClick={onSaveMap}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};
export default UploadMap;

function onSaveMap() {}
