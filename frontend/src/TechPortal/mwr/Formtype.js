import style from './Formtype.module.css'
import { useEffect, useRef, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2'
import { BsArrowLeftCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { updateTabData } from '../../redux/slices/tabSlice';
import { setSmallLoading } from '../../redux/slices/loading';

function Formtype() {
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const [alert, setalert] = useState(false);
    const alertManager = () => {
        setalert(!alert)
    }
    const [machine, setMachine] = useState();
    const user = useSelector(state => state.auth.user);
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();
    const dateType = useSelector(state => state.appData.dateType);
    const idToWatch = useSelector(state => state.idToProcess);

    useEffect(() => {
        dispatch(setSmallLoading(true))
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/readMachinery/${idToWatch}`).then((res) => {
            setMachine(res.data.data)
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };
    const [formData, setFormData] = useState(null);
    const handleImageClick = () => {
        fileInputRef.current.click(); // Trigger the click event on the file input
    };


    const makeRequest = () => {
        if (formData) {
            dispatch(setSmallLoading(true))
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/addPreventiveMaintaince/${idToWatch}`, {...formData, submitBy : user.Name}, { headers: { Authorization: `${user.Department._id}` } }).then((res) => {
                dispatch(setSmallLoading(false))
                Swal.fire({
                    title: 'Success',
                    text: 'Submitted Successfully',
                    icon: 'success',
                    confirmButtonText: 'Go!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        dispatch(updateTabData({ ...tabData, Tab: 'Machinery' }))
                    }
                })
            }).catch(err => {
                dispatch(setSmallLoading(false));
                Swal.fire({
                    icon: 'error',
                    title: 'OOps..',
                    text: 'Something went wrong, Try Again!'
                })
            })
        }
    }
    return (
        <>
                <div className='d-flex flex-row bg-white px-lg-5 mx-1 px-2 py-2'>
                    <BsArrowLeftCircle role='button' className='fs-3 mt-1 text-danger' onClick={(e) => {
                        {
                            dispatch(updateTabData({ ...tabData, Tab: 'Machinery' }))
                        }
                    }} />

                </div>
                <div className={`${style.headers} mt-1 `}>
                    <div className={style.spans}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className={style.para}>
                        Maintainance Record
                    </div>

                </div>

                <div className={style.form}>
                    <div className={style.sec1}>
                        <div>
                            <p>Machine Id</p>
                            <p className={style.value}>{machine?.machineCode}</p>
                        </div>
                        <div>
                            <p>Machine name</p>
                            <p className={style.value}>{machine?.machineName}</p>

                        </div>




                    </div>
                    <div className={style.sec2}>
                        <div>

                            <p>Machine Location :</p>
                            <p className={style.value}>{machine?.machinaryLocation}</p>

                        </div>






                    </div>
                </div>


                <form encType='multipart/form-data' onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.target);
                    console.log(data);
                    setFormData(data);
                    alertManager();
                }}>

                    <div className={style.form}>
                        <div className={style.sec1}>

                            <div>
                                <p>Date type</p>
                                <input autoComplete='off' name='dateType' value={dateType} type="text" />
                            </div>


                            <div>
                                <p>Root Cause of Breakdown</p>
                                <textarea name='rootCause' type="text" required />
                            </div>
                            <div>
                                <p>Nature of fault</p>
                                <textarea name='natureOfFault' type="text" required />
                            </div>

                        </div>
                        <div className={style.sec2}>

                            <div>
                                <p>Maintainance type</p>
                                <input autoComplete='off' name='maintenanceType' value='Preventive' type="text" />
                            </div>

                            <div>
                                <p>Detail of Work :</p>
                                <textarea name='detailOfWork' type="text" required />
                            </div>
                            <div>
                                <p>Replacement</p>
                                <textarea name='replacement' type="text" required />
                            </div>




                        </div>
                    </div>
                    <div className={style.btnparent}>
                        <a className='btn btn-danger' onClick={() => {
                            handleImageClick();
                            setalert(false);
                        }}>{selectedImage?.name?.slice(0, 15) || "Upload Image"}</a>
                        <a className='btn btn-outline-danger' onClick={() => {
                            // navigate('/tech/maintanancerect2')
                        }}>Generate Certificate</a>
                        <input autoComplete='off' onChange={handleImageChange} accept='.jpg, .jpeg, .png' name='Image' type='file' ref={fileInputRef} style={{ display: 'none' }} />
                    </div>

                    <div className={style.btnparent2}>
                        <button type='submit' className='btn btn-danger px-3 py-2' >Submit</button>
                    </div>

                </form>

            {
                alert ?
                    <div class={style.alertparent}>
                        <div className='bg-light p-3'>
                            <p class={style.msg}>Do you want to submit the data ?</p>
                            <div className={style.alertbtns}>
                                <button onClick={() => {
                                    makeRequest();
                                    alertManager();
                                }} className={style.btn2}>Submit</button>
                                <button onClick={alertManager} className={style.btn2}>Cancel</button>
                            </div>
                        </div>
                    </div> : null
            }


        </>
    )
}

export default Formtype
