import style from './AddChangeRequest.module.css'
import { useEffect, useRef, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2'
import { BsArrowLeftCircle } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { updateTabData } from '../../redux/slices/tabSlice';
import { setLoading } from '../../redux/slices/loading';

function AddChangeRequest() {
    
    const [dataToSend, setDataToSend] = useState(null);
    const [alert, setalert] = useState(false);
    const [documents, setDocuments] = useState(null);
    const updateData = (event)=>{
        setDataToSend({...dataToSend, [event.target.name] : event.target.value})
    }
    const alertManager = () => {
        setalert(!alert)
    }


    const userToken = Cookies.get('userToken');
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true))
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-documents`, { headers: { Authorization: `Bearer ${userToken}` } }).then((response) => {
            setDocuments(response.data.data);
            if(departmentsToShow){
                dispatch(setLoading(false))
            }
        }).catch(err => {
            dispatch(setLoading(false));
            Swal.fire({
                icon : 'error',
                title : 'OOps..',
                text : 'Something went wrong, Try Again!'
            })
        })
    }, [])
    useEffect(()=>{
        console.log(dataToSend);
    }, [dataToSend])
    const [departmentsToShow, SetDepartmentsToShow] = useState(null);
    const user = useSelector(state => state.auth?.user);

    useEffect(() => {
        dispatch(setLoading(true))
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-department/${user?.Company?._id}`, { headers: { Authorization: `Bearer ${userToken}` } }).then((res) => {
            SetDepartmentsToShow(res.data.data);
            if (documents) {
                dispatch(setLoading(false))
            }
        }).catch(err => {
            dispatch(setLoading(false));
            Swal.fire({
                icon : 'error',
                title : 'OOps..',
                text : 'Something went wrong, Try Again!'
            })
        })
    }, [])


    const makeRequest = () => {
        if (dataToSend) {
            dispatch(setLoading(true))
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/addChangeRequest`, dataToSend, { headers: { Authorization: `Bearer ${userToken}` } }).then(() => {
                console.log("request made !");
                setDataToSend(null);
                dispatch(setLoading(false))
                Swal.fire({
                    title: 'Success',
                    text: 'Submitted Successfully',
                    icon: 'success',
                    confirmButtonText: 'Go!',

                }).then((result) => {
                    if (result.isConfirmed) {
                        dispatch(updateTabData({...tabData, Tab : 'Document Change Creation'}))
                    }
                })

            }).catch(err => {
                dispatch(setLoading(false));
                Swal.fire({
                    icon : 'error',
                    title : 'OOps..',
                    text : 'Something went wrong, Try Again!'
                })
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Try filling data again',
                confirmButtonText: 'OK.'
            })
        }
    }
    
    return (
        <>
            <div className={`${style.parent} mx-auto`}>


                <div className={`${style.subparent} mx-2 mx-sm-4 mt-5 mx-lg-5`}>
                 <div className='d-flex flex-row bg-white px-lg-5 mx-lg-5 mx-3 px-2 py-2'>
                    <BsArrowLeftCircle 
                        role='button' className='fs-3 mt-1 text-danger' onClick={(e) => {
                            {
                                dispatch(updateTabData({...tabData, Tab : 'Document Change Creation'}))
                            }
                        }} />

                </div>
                
                    <div className={`${style.headers} d-flex justify-content-start ps-3 align-items-center `}>
                        <div className={style.spans}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className={`${style.heading} ms-3 `}>
                            Add Document Change Request
                        </div>
                    </div>
                    <form encType='multipart/form-data' onSubmit={(event) => {
                        event.preventDefault();
                       
                        
                        alertManager();


                    }}>
                        <div className={`${style.myBox}`}>

                            <div className={style.formDivider}>
                                <div className={style.sec1}>
                                    <div className={style.inputParent}>
                                        <div className={style.para}>
                                            <p>Document Title</p>

                                        </div>
                                        <div>
                                            <select onChange={(e)=>{
                                                updateData(e)
                                            }} name='Document' style={{ width: "100%" }} required>
                                                <option value="" selected disabled>Choose Title</option>
                                                {documents?.map((document) => {

                                                    return (

                                                        <option value={document._id}>{document.DocumentTitle}</option>
                                                    )
                                                })}
                                            </select>


                                        </div>
                                    </div>
                                    <div className={style.inputParent}>
                                        <div className={style.para}>
                                            <p>Line no</p>

                                        </div>
                                        <div>
                                            <input onChange={(e)=>{
                                                updateData(e)
                                            }} name='LineNo' className='p-2 text-dark' type='number' />

                                        </div>
                                    </div>
                                    <div className={style.inputParent}>
                                        <div className={style.para}>
                                            <p>Paragraph No</p>

                                        </div>
                                        <div>
                                            <input onChange={(e)=>{
                                                updateData(e)
                                            }} name='ParagraphNo' className='p-2 text-dark' type='number' />

                                        </div>
                                    </div>
                                </div>
                                <div className={style.sec2}>
                                    <div className={style.inputParent}>
                                        <div className={style.para}>
                                            <p>Department</p>
                                        </div>
                                        <div>
                                            <select onChange={(e)=>{
                                                updateData(e)
                                            }} name='Department' style={{ width: "100%" }} required >
                                                <option value="" selected disabled>Choose Department</option>
                                                {departmentsToShow?.map((depObj) => {
                                                    return (
                                                        <option value={depObj._id}>{depObj.DepartmentName}</option>
                                                    )
                                                })}

                                            </select>

                                        </div>
                                    </div>

                                    <div className={style.inputParent}>
                                        <div className={style.para}>
                                            <p>Page No</p>

                                        </div>
                                        <div>
                                            <input onChange={(e)=>{
                                                updateData(e)
                                            }} name='PageNo' className='p-2 text-dark' type='number' />

                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className='px-5'>
                                <p style={{
                                    fontFamily: 'Inter'
                                }} className='fs-5'>Reason of Change</p>
                                <textarea onChange={(e)=>{
                                                updateData(e)
                                            }} name='ReasonForChange' style={{
                                    borderRadius: '8px',
                                    fontFamily: 'Inter'
                                }} rows={10} className='p-3 w-100 border-0 text-dark'  />
                            </div>

                        </div>


                        <div className={style.btn}>
                            <button type='submit' >Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            {
                alert ?
                    <div class={style.alertparent}>
                        <div class={style.alert}>
                            <p class={style.msg}>Do you want to submit this information?</p>
                            <div className={style.alertbtns}>
                                <button onClick={() => {
                                    alertManager();
                                    makeRequest();

                                }} className={style.btn1}>Submit</button>


                                <button onClick={alertManager} className={style.btn2}>Cancel</button>

                            </div>
                        </div>
                    </div> : null
            }

        </>
    )
}

export default AddChangeRequest
