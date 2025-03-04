import React from 'react';
import { useTypedDispatch, useTypedSelector } from '../hooks/useStore';
import { useValidation } from '../hooks/useValidation';
import Title from '../components/UI/common/Title';
import Input from '../components/UI/common/Input';
import Select from '../components/UI/common/Select';
import FormFooter from '../components/UI/common/FormFooter';
import Loader from '../components/UI/common/Loader';
import { officerFields } from '../utils/fields';
import { clearForm } from '../store/slices/privateFormSlice';
import { updateOfficer, deleteOfficer, } from '../store/actionCreators';
import { officersAPI } from '../API/Query';
import { errorData } from '../types/error';

const Profile = () => {
    const dispatch = useTypedDispatch();
    const { auth: { user }, loading: { loading }, privateForms: { officerData } } = useTypedSelector(state => state);
    const [onChange] = useValidation('officer');
    const { data: officerInfo, isLoading, error } = officersAPI.useFetchOneOfficerQuery(user.id);
    const officer = officerInfo?.data;

    const edit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await dispatch(updateOfficer(officerData, user.id));
        dispatch(clearForm());
    }

    const remove = async () => {
        await dispatch(deleteOfficer(officer?._id));
    }

    if (error) return <Title>{(error as errorData).data.message}</Title>
    return (
        isLoading ?
            <Loader />
            :
            <form
                onSubmit={edit}
                className={`${window.innerWidth > 1000 ? 'w-50' : 'w-75'} mx-auto`}>
                <Title>{officer?.firstName && officer?.lastName ?
                    officer.firstName + ' ' + officer.lastName : officer?.email}
                </Title>
                <Input value={officer?._id} field={officerFields.id} />
                <Input value={officer?.email} field={officerFields.email} />
                <Input
                    onChange={onChange}
                    value=''
                    field={officerFields.password} />
                <Input
                    onChange={onChange}
                    value={officer?.firstName}
                    field={officerFields.firstName} />
                <Input
                    onChange={onChange}
                    value={officer?.lastName}
                    field={officerFields.lastName} />
                <Select
                    onChange={onChange}
                    options={officer?.approved ? ['Нет'] : ['Да']}
                    value={officer?.approved ? 'Да' : 'Нет'}
                    field={officerFields.approved} />
                <FormFooter
                    name='Изменить данные'
                    disabled={Object.keys(officerData).length ? false : true}
                    onClick={remove} />
                {loading && <Loader />}
            </form>
    );
};

export default Profile;