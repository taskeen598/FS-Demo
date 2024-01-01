import style from './ViewProcessDetails.module.css'
import Search from '../../assets/images/employees/Search.svg'
import { useEffect, useState } from 'react'
import axios from "axios";
import { BsArrowLeftCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { updateTabData } from '../../redux/slices/tabSlice';
import { changeId } from '../../redux/slices/idToProcessSlice';
import { setLoading } from '../../redux/slices/loading';
import Swal from 'sweetalert2';

function ViewProcessDetails() {
    const [processes, setProcesses] = useState(null);
    const [showBox, setShowBox] = useState(false);
    const [dataToShow, setDataToShow] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(8);
    const [processListData, setProcessListData] = useState(null);
    const user = useSelector(state => state.auth.user);
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();
    const idToWatch = useSelector(state => state.idToProcess);

    useEffect(() => {
        dispatch(setLoading(true))
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-process/${idToWatch}`, { headers: { Authorization: `${user._id}` } }).then((response) => {
            console.log(response.data);
            setProcessListData(response.data.data)
            setProcesses(response.data.data?.ProcessDetails.slice(startIndex, endIndex));
            dispatch(setLoading(false))
        }).catch(err => {
            dispatch(setLoading(false));
            Swal.fire({
                icon : 'error',
                title : 'OOps..',
                text : 'Something went wrong, Try Again!'
            })
        })
    }, [])


    const nextPage = () => {
        setStartIndex(startIndex + 8);
        setEndIndex(endIndex + 8);
    }

    const backPage = () => {
        setStartIndex(startIndex - 8);
        setEndIndex(endIndex - 8);
    }

    useEffect(() => {
        setProcesses(processListData?.ProcessDetails.slice(startIndex, endIndex))
    }, [startIndex, endIndex])


    const search = (event) => {
        if (event.target.value !== "") {
            console.log(event.target.value);

            const searchedList = processListData?.ProcessDetails.filter((obj) =>

                obj.Name.includes(event.target.value)
            )
            console.log(searchedList);
            setProcesses(searchedList);
        } else {
            setProcesses(processListData?.ProcessDetails.slice(startIndex, endIndex))
        }
    }



    return (
        <>

            <div className={style.subparent}>
                <div className='d-flex flex-row bg-white px-lg-5  px-2 py-2'>
                    <BsArrowLeftCircle
                        role='button' className='fs-3 mt-1 text-danger' onClick={(e) => {
                            {
                                dispatch(updateTabData({...tabData, Tab : 'Construct Flow Diagram'}))
                            }
                        }} />

                </div>
                <div className={`${style.searchbar} mt-1 `}>
                    <div className={style.sec1}>
                        <img src={Search} alt="" />
                        <input onChange={search} type="text" placeholder='Search document by name' />
                    </div>

                </div>
                <div className={style.tableParent}>
                    {!processes || processes?.length === 0 ? (
                        <div className='w-100 d-flex align-items-center justify-content-center'>
                            <p className='text-center'>No any Records Available here.</p>
                        </div>
                    ) : (

                        <table className={style.table}>
                            <tr className={style.headers}>
                                <td>Process Number</td>
                                <td>Name</td>
                                <td>Process Description</td>
                                <td>Sub Processes</td>
                            </tr>
                            {
                                processes?.map((process, i) => {
                                    return (
                                        <tr className={style.tablebody} key={i}>

                                            <td className={style.simpleContent}>{process.ProcessNum}</td>
                                            <td className={style.simpleContent}>{process.Name}</td>
                                            <td >
                                                <p onClick={() => {
                                                    setShowBox(true);
                                                    setDataToShow(process.Description)
                                                }} className={style.redclick}>View</p>
                                            </td>
                                            <td >
                                                <p onClick={() => {
                                                    if(process.subProcesses.length > 0){
                                                        dispatch(updateTabData({...tabData, Tab : 'viewSubProcesses'}));
                                                        dispatch(changeId(process._id));
                                                    } else {

                                                    setShowBox(true);
                                                    setDataToShow('No Sub Process is added!')
                                                    }
                                                }} className={style.redclick}>View</p>
                                            </td>
                                        </tr>

                                    )

                                })
                            }
                        </table>
                    )}
                </div>
                <div className={style.Btns}>
                    {startIndex > 0 && (

                        <button onClick={backPage}>
                            {'<< '}Back
                        </button>
                    )}
                    {processListData?.ProcessDetails.length > endIndex && (

                        <button onClick={nextPage}>
                            next{'>> '}
                        </button>
                    )}
                </div>
            </div>

            {
                showBox && (

                    <div class={style.alertparent}>
                        <div class={style.alert}>

                            <p class={style.msg}>{dataToShow}</p>

                            <div className={style.alertbtns}>

                                <button onClick={() => {
                                    setShowBox(false);

                                }} className={style.btn2}>OK</button>

                            </div>
                        </div>
                    </div>
                )
            }


        </>
    )
}

export default ViewProcessDetails
