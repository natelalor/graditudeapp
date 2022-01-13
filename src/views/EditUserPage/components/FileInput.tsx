import {
    Typography, Button, Paper, IconButton
} from '@material-ui/core';
import { Upload, Clear } from '@material-ui/icons';
import clsx from 'clsx';
import { useState, DragEvent, useContext } from 'react';

import { UserContext } from '../../../App';

import styles from './FileInput.module.scss';


interface FileInputProps {
    title: 'file' | 'picture'
    acceptedFileTypes: string[];
    onSave: (newFile: LinkedFile) => Promise<void>;
    compact?: boolean;
    className?: string;
    hideDropZone?: boolean;
}

export class LinkedFile extends File {
    url?: string;

    constructor(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag | undefined, url?: string) {
        super(fileBits, fileName, options);
        this.url = url;
    }
}

export function FileInput({
    title, acceptedFileTypes, onSave, compact, className, hideDropZone
}: FileInputProps) {
    const [ inDropZone, setInDropZone ] = useState(false);
    const [ file, setFile ] = useState<LinkedFile>();
    const { user } = useContext(UserContext);
    const [ isLoading, setIsLoading ] = useState(false);

    function isValidFile(file: File) {
        const fileType = file.name.split('.')[1] ?? '';
        return acceptedFileTypes.includes(fileType);
    }

    async function addFiles() {
        if (file) {
            setIsLoading(true);
            await onSave(file);
            setIsLoading(false);
            setFile(undefined);
        }
    }

    function handleDragEvent(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === 'dragover') {
            event.dataTransfer.dropEffect = 'copy';
        } else {
            if (event.type === 'drop') {
                const newFile = event.dataTransfer.files[0] as LinkedFile;

                if (newFile && isValidFile(newFile)) {
                    newFile.url = URL.createObjectURL(newFile);
                    setFile(newFile);
                }
            }

            setInDropZone(event.type === 'dragenter');
        }
    }

    return (
        <div
            className={clsx(styles.fileInputContainer, className, {
                [styles.compact]: compact
            })}
        >
            {file && (
                <IconButton onClick={() => setFile(undefined)}>
                    <Clear />
                </IconButton>
            )}

            <img
                src={file?.url || user?.picture}
                alt="alt"
            />

            <div
                className={clsx(styles.dropZone, {
                    [styles.dropZoneActive]: inDropZone,
                    [styles.compact]: compact,
                    [styles.hidden]: hideDropZone
                })}
                onDrop={handleDragEvent}
                onDragOver={handleDragEvent}
                onDragEnter={handleDragEvent}
                onDragLeave={handleDragEvent}
            >
                <Upload
                    fontSize="large"
                    color="secondary"
                />

                <Typography
                    align="center"
                    color="textSecondary"
                    variant={compact ? 'body2' : undefined}
                >
                    {`Drag and drop ${title}s to upload`}
                </Typography>

                <label htmlFor="file-upload">
                    <input
                        id="file-upload"
                        style={{ display: 'none' }}
                        type="file"
                        onChange={e => {
                            const newFile = e.target.files?.[0];
                            if (newFile && isValidFile(newFile)) {
                                setFile(newFile);
                            }
                        }}
                    />

                    <Button
                        component="span"
                        size={compact ? 'small' : undefined}
                    >
                        {`Browse ${title}s instead`}
                    </Button>
                </label>
            </div>

            <Paper
                variant="outlined"
                className={clsx(styles.filesContainer, {
                    [styles.compact]: compact
                })}
            >
                <Button
                    onClick={() => addFiles()}
                    disabled={isLoading}
                >
                    Save
                </Button>

                {/* <Paper
                    className={clsx(styles.fileCard, {
                        [styles.compact]: compact
                    })}
                    variant="outlined"
                    key={file.name}
                >
                    <Typography variant={compact ? 'body2' : undefined}>
                        {file.url ? (
                            <Link
                                href={file.url}
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                {file.name}
                            </Link>
                        ) : file.name}
                    </Typography>

                    <Tooltip title="Remove file">
                        <IconButton
                            edge="end"
                            size={compact ? 'small' : undefined}
                            onClick={() => onRemoveFile(file)}
                        >
                            <RemoveCircleOutline
                                color="error"
                                fontSize={compact ? 'small' : undefined}
                            />
                        </IconButton>
                    </Tooltip>
                </Paper> */}
            </Paper>
        </div>
    );
}
