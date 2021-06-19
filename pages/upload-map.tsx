import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Input, Typography } from '@material-ui/core';
import { ResponseUploadMap } from '../common/upload-map.response';
import { SaveGpxTracksRequest } from '../common/save-gpx-tracks.request';

interface UploadMapProps {
    setMap: React.Dispatch<React.SetStateAction<ResponseUploadMap | null>>;
    currentMap: ResponseUploadMap | null;
}

const UploadMap: React.FC<UploadMapProps> = (props) => {
    const [fileName, setFileName] = useState<string>('');
    const [input, setInput] = useState('');

    const handleOnChange = async (event: React.FormEvent<HTMLInputElement>) => {
        const { files } = event.target as HTMLInputElement;

        if (!files) {
            return;
        }

        const response = await fetch('/api/upload-map', {
            method: 'POST',
            body: files[0],
            headers: {
                // Content-Type may need to be completely **omitted**
                // or you may need something
                'Content-Type': files[0].type,
            },
        });

        const result: ResponseUploadMap = await response.json();
        console.log('result', result);

        setFileName(files[0].name);
        props.setMap(result);

        const name = files[0].name
            .substring(0, files[0].name.lastIndexOf('.'))
            .replaceAll(' ', '-')
            .toLowerCase();

        setInput(name);
    };

    const onSaveMap = async () => {
        if (!input) {
            // eslint-disable-next-line no-alert
            alert('Missing collection name');
            return;
        }

        if (!props.currentMap) {
            // eslint-disable-next-line no-alert
            alert('Missing current map');
            return;
        }

        const request: SaveGpxTracksRequest = {
            mapTracks: props.currentMap.geoJson,
            collectionHash: props.currentMap.name,
            collectionName: input,
        };

        await fetch('/api/save-map-tracks', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
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
                    <Input
                        style={{ width: '300px' }}
                        value={input}
                        onInput={(e) => setInput((e.target as HTMLInputElement).value)}
                        placeholder="Collection name"
                    />
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
