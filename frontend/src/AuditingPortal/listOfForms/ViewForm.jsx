import style from './CreateForm.module.css'
import { useEffect, useRef, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2'
import { BiMenuAltLeft, BiTimeFive } from 'react-icons/bi'
import { BsTextParagraph, BsFillGrid3X3GapFill, BsGrid3X3, BsArrowLeftCircle } from "react-icons/bs"
import { MdRadioButtonChecked, MdOutlineCheckBox, MdOutlineDateRange } from 'react-icons/md';
import { IoIosArrowDropdown } from 'react-icons/io';
import { AiOutlineLine } from 'react-icons/ai';
import { FaMinus } from 'react-icons/fa'
import Select from 'react-select';
import { BiPlus } from 'react-icons/bi'
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { updateTabData } from '../../redux/slices/tabSlice';
import { setSmallLoading } from '../../redux/slices/loading';

function ViewForm() {

    const [alert, setalert] = useState(false);
    const [dataToSend, setDataToSend] = useState(null);
    const alertManager = () => {
        setalert(!alert)
    }
    const [questions, setQuestions] = useState([]);
    const user = useSelector(state => state.auth.user);
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();
    const idToWatch = useSelector(state => state.idToProcess);



    useEffect(() => {
        dispatch(setSmallLoading(true))
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-form-by-id/${idToWatch}`).then((res) => {
            setDataToSend(res.data.form);
            setQuestions(res.data.form.questions);
            dispatch(setSmallLoading(false))
        }).catch(err => {
            dispatch(setSmallLoading(false));
            Swal.fire({
                icon: 'error',
                title: 'OOps..',
                text: 'Something went wrong, Try Again!'
            })
        })
    }, [])


    return (
        <>

            <div className={style.parent}>

                <div className={`${style.form} mt-5 `}>
                    <div className='d-flex flex-row bg-white px-lg-3  px-2 py-2'>
                        <BsArrowLeftCircle
                            role='button' className='fs-3 mt-1 text-danger' onClick={(e) => {
                                {
                                    dispatch(updateTabData({ ...tabData, Tab: 'Master List of Records/Forms' }))
                                }
                            }} />

                    </div>
                    <div className={style.headers}>
                        <div className={style.spans}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className={style.para}>
                            View Form
                        </div>

                    </div>
                    <div className={`${style.sec1}  px-3`}>
                        <form encType='multipart/form-data' onSubmit={(event) => {
                            event.preventDefault();

                            alertManager();
                        }}>


                            <div className='w-100'>
                                <p className='text-black'>Department</p>
                                <div>
                                    <input autoComplete='off' value={dataToSend?.Department.DepartmentName} className='w-100' name='FormDescription' type="text" readOnly />
                                </div>
                            </div>
                            <div className='w-100'>
                                <p className='text-black'>Document Type</p>
                                <div>
                                    <input autoComplete='off' value={dataToSend?.DocumentType} className='w-100' name='FormDescription' type="text" readOnly />
                                </div>
                            </div>

                            <div className='w-100'>
                                <p className='text-black'>Maintenance Frequency</p>
                                <div>
                                    <input autoComplete='off' value={dataToSend?.MaintenanceFrequency} className='w-100' name='FormDescription' type="text" readOnly />
                                </div>
                            </div>

                            <div className='w-100'>
                                <p className='text-black'>Form Name</p>
                                <div>

                                    <input autoComplete='off' value={dataToSend?.FormName} className='w-100' name='FormName' type="text" readOnly />
                                </div>
                            </div>
                            <div className='w-100'>
                                <p className='text-black'>Form Description</p>
                                <div>
                                    <input autoComplete='off' value={dataToSend?.FormDescription} className='w-100' name='FormDescription' type="text" readOnly />
                                </div>
                            </div>


                            {questions.map((question, index) => {
                                return (
                                    <div style={{
                                        borderRadius: '6px'
                                    }} className='bg-white my-4 p-3'>
                                        <div className='d-flex bg-white justify-content-between '>
                                            <div style={{
                                                width: '100%'
                                            }} className=' me-3 d-flex flex-column'>
                                                <input autoComplete='off' value={dataToSend?.questions[index]?.questionText} style={{
                                                    borderRadius: '0px'
                                                }} name='questionText' className='border-bottom border-secondary bg-light mt-2 mb-3 w-100 p-3' readOnly />

                                            </div>

                                        </div>


                                        {(questions[index].questionType === 'ShortText' || questions[index].questionType === 'LongText') && (
                                            <div>


                                            </div>

                                        )}

                                        {(questions[index].questionType === 'Multiplechoicegrid') && (
                                            <>

                                                <div className={`${style.gridCover}`}>
                                                    <table className='table table-bordered'>
                                                        <thead>
                                                            <tr>
                                                                <th style={{
                                                                    minWidth: '120px'
                                                                }}>R\C</th>
                                                                {questions[index]?.columns.map((column, colIndex) => {
                                                                    return (
                                                                        <th style={{
                                                                            minWidth: '80px'
                                                                        }}>
                                                                            <input autoComplete='off' value={dataToSend?.questions[index].columns[colIndex].colTitle} className={`bg-light border-bottom border-secondary d-inline py-0 px-1 mx-1 ${style.noRadius}`} type='text' required readOnly />
                                                                        </th>
                                                                    )
                                                                })}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {questions[index]?.rows?.map((row, rowIndex) => {
                                                                return (

                                                                    <tr>
                                                                        <td>
                                                                            <span>{rowIndex + 1}.</span>
                                                                            <input autoComplete='off' value={dataToSend?.questions[index].rows[rowIndex].rowTitle} name='rowTitle' type='text' style={{
                                                                                borderRadius: '0px'
                                                                            }} className='bg-light border-bottom border-secondary  px-2 py-0 d-inline' readOnly />
                                                                        </td>
                                                                        {questions[index]?.columns.map((colnum, colIndex) => {
                                                                            return (
                                                                                <td>
                                                                                    <input autoComplete='off' className='mx-2' style={{
                                                                                        width: '20px',
                                                                                        height: '20px'
                                                                                    }} name={`R${rowIndex}`} type='radio' readOnly />
                                                                                </td>
                                                                            )
                                                                        })}
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </>
                                        )}

                                        {(questions[index].questionType === 'Checkboxgrid') && (
                                            <>
                                                <div className={`${style.gridCover}`}>
                                                    <table className='table table-bordered'>
                                                        <thead>
                                                            <tr>
                                                                <th style={{
                                                                    minWidth: '120px'
                                                                }}>R\C</th>
                                                                {questions[index]?.columns.map((column, colIndex) => {
                                                                    return (
                                                                        <th style={{
                                                                            minWidth: '80px'
                                                                        }}>
                                                                            <input autoComplete='off' value={dataToSend?.questions[index].columns[colIndex].colTitle} className={`bg-light border-bottom border-secondary d-inline py-0 px-1 mx-1 ${style.noRadius}`} type='text' required readOnly />
                                                                        </th>
                                                                    )
                                                                })}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {questions[index]?.rows?.map((row, rowIndex) => {
                                                                return (

                                                                    <tr>
                                                                        <td>
                                                                            <span>{rowIndex + 1}.</span>
                                                                            <input autoComplete='off' value={dataToSend?.questions[index].rows[rowIndex].rowTitle} name='rowTitle' type='text' style={{
                                                                                borderRadius: '0px'
                                                                            }} className='bg-light border-bottom border-secondary  px-2 py-0 d-inline' readOnly />
                                                                        </td>
                                                                        {questions[index]?.columns.map((colnum, colIndex) => {
                                                                            return (
                                                                                <td>
                                                                                    <input autoComplete='off' className='mx-2' style={{
                                                                                        width: '20px',
                                                                                        height: '20px'
                                                                                    }} type='checkbox' readOnly />
                                                                                </td>
                                                                            )
                                                                        })}
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>




                                            </>

                                        )}




                                        {(questions[index].questionType === 'Dropdown' || questions[index].questionType === 'Checkbox' || questions[index].questionType === 'Multiplechoice') && (
                                            <div className=' d-flex flex-column'>


                                                {questions[index]?.options?.map((option, optindex) => {
                                                    return (

                                                        <div className='my-2 d-flex flex-row'>


                                                            <span>{optindex + 1}.</span>

                                                            <input autoComplete='off' type='text' value={dataToSend?.questions[index]?.options[optindex].optionText} style={{
                                                                borderRadius: '0px'
                                                            }} name='optionText' className='bg-light border-bottom border-secondary w-50 px-2 py-0 d-inline' readOnly />
                                                        </div>
                                                    )
                                                })}





                                            </div>

                                        )}


                                        {questions[index].questionType === 'Linearscale' && (
                                            <div className=' d-flex flex-column'>

                                                <div className='d-flex flex-row '>
                                                    <div className='d-flex flex-column'>
                                                        <span>Low :</span>

                                                        <Select value={dataToSend?.questions[index].minValue} isDisabled />
                                                    </div>
                                                    <div className='d-flex flex-column'>
                                                        <span>-</span>

                                                        <span className='mx-2'>To</span>
                                                    </div>
                                                    <div className='d-flex flex-column'>
                                                        <span>High :</span>
                                                        <Select value={dataToSend?.questions[index].maxValue} isDisabled />
                                                    </div>
                                                </div>

                                            </div>

                                        )}




                                        <div className='my-2 mt-4 d-flex justify-content-end'>


                                            <p className='mx-2 mt-1' style={{
                                                fontFamily: 'Inter',
                                                color: 'black'
                                            }}>Required</p>
                                            <label className={style.switch}>
                                                <input autoComplete='off' className='ms-3' name='IsPass' type="checkbox" checked={dataToSend?.questions[index].Required} />
                                                <span className={`${style.slider} ${style.round}`} ></span>
                                            </label>

                                        </div>
                                    </div>
                                )
                            })}

                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ViewForm
