/* eslint camelcase: "off" */
import { useAuth0 } from '@auth0/auth0-react';
import { Button, IconButton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RouteComponentProps, useParams } from 'react-router-dom';

import { UserContext } from '../../App';
import api from '../../api';
import { Dialog } from '../../components/Dialog/Dialog';
import { TextField } from '../../components/form/TextField';
import { uploadFileToS3, User } from '../../database/db';

import styles from './EditUserPage.module.scss';
import { FileInput } from './components/FileInput';


export interface EditUserPageParams {
    accountId: string;
}

export type UserFormValues = Partial<User> & {

}

export function EditUserPage({ match, history }: RouteComponentProps<EditUserPageParams>) {
    const { accountId } = useParams<EditUserPageParams>();
    const { isAuthenticated, user: auth0User } = useAuth0();
    const { user, setUser } = useContext(UserContext);

    const [ open, setOpen ] = useState(false);

    const formMethods = useForm<UserFormValues>({ defaultValues: user });

    const handleSubmit = formMethods.handleSubmit(async formValues => {
        const { given_name, family_name, bio } = formValues;
        if (!given_name || !family_name || !user) {
            return;
        }

        try {
            await api.users.updateUser(accountId, [
                {
                    name: 'updated_at',
                    value: new Date().toISOString()
                },
                {
                    name: 'given_name',
                    value: given_name
                },
                {
                    name: 'family_name',
                    value: family_name
                },
                {
                    name: 'bio',
                    value: bio
                }
            ]); // TODO use response here to set user in state

            setUser({
                ...user,
                given_name,
                family_name,
                bio
            });

            history.push(`/account/${user.id}`);
        } catch (error) {
            console.log(error);
        }
    });

    const updateProfilePicture = async (file: File) => {
        if (!user) {
            return;
        }

        try {
            const value = await uploadFileToS3(file);

            await api.users.updateUser(accountId, [
                {
                    name: 'picture',
                    value
                }
            ]); // TODO use response here to set user in state

            setUser({
                ...user,
                picture: value
            });

            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    return isAuthenticated && (accountId === auth0User?.['http://localhost:3000/user_id']) ? (
        <div className={styles.root}>
            {user && (
                <form onSubmit={handleSubmit}>
                    <FormProvider {...formMethods}>
                        <div className={styles.profilePictureBox}>
                            <div
                                className={styles.profilePictureBackground}
                                style={{
                                    backgroundImage: `url('${user.picture}')`
                                }}
                            />

                            <IconButton
                                className={styles.editPictureIcon}
                                size="large"
                                onClick={() => setOpen(true)}
                            >
                                <Edit />
                            </IconButton>
                        </div>

                        <Dialog
                            title="Change profile picture"
                            open={open}
                            onClose={() => setOpen(false)}
                        >
                            <FileInput
                                title="picture"
                                acceptedFileTypes={[ 'jpg', 'png' ]}
                                onSave={updateProfilePicture}
                            />

                        </Dialog>

                        <TextField<UserFormValues>
                            name="given_name"
                            label="First name"
                        />

                        <TextField<UserFormValues>
                            name="family_name"
                            label="Last name"
                        />

                        <TextField<UserFormValues>
                            name="bio"
                            label="bio"
                        />

                        {/* <TextField<UserFormValues>
                            name="userName" // TODO
                        /> */}

                        <Button type="submit">
                            Save
                        </Button>
                    </FormProvider>
                </form>
            )}
        </div>
    ) : (
        <div>
            {/* TODO Abstract into reusable not authorized page */}
            You are not authenticated to view this page
        </div>
    );
}
