import style from './ActionsList.module.css'
import { useEffect, useState } from 'react'
import axios from "axios";
import Swal from 'sweetalert2';
import { BsArrowLeftCircle } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { updateTabData } from '../../redux/slices/tabSlice';
import { changeId } from '../../redux/slices/idToProcessSlice';
import { setLoading } from '../../redux/slices/loading';


function ActionsList() {

    const [alert, setalert] = useState(false);
    const [popUpData, setPopUpData] = useState(null);
    const alertManager = () => {
        setalert(!alert)
    }
    const [actions, setActions] = useState(null);
    const userToken = Cookies.get('userToken');
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();
    const idToWatch = useSelector(state => state.idToProcess)

    const formatDate = (date) => {

        const newDate = new Date(date);
        const formatDate = newDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        return formatDate;
    }
    useEffect(() => {
        console.log(idToWatch);
        dispatch(setLoading(true))
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/readCorrectiveActionByReportId/${idToWatch}`, { headers: { Authorization: `Bearer ${userToken}` } }).then((response) => {
            console.log(response.data.data);
            setActions(response.data.data);

            dispatch(setLoading(false))
            if (response.data.data == undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Report is not Created for this Audit yet!',
                    confirmButtonText: 'OK.'

                }).then((result) => {
                    if (result.isConfirmed) {
                        dispatch(updateTabData({...tabData, Tab : 'Corrective Action Plan'}))
                        
                    }
                })
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
   


    return (
        <>
            <div className={style.subparent}>
                <div className='mx-lg-5 px-2 mx-md-4 mx-2 mt-5 mb-1 '>
                    <BsArrowLeftCircle onClick={(e) => {
                        dispatch(updateTabData({ ...tabData, Tab: 'Corrective Action Plan' }))
                    }} className='fs-3 text-danger mx-1' role='button' />
                </div>
                <div className={`${style.headers} mt-0`}>
                    <div className={style.spans}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className={style.para}>
                        Corrective Actions List
                    </div>

                </div>
                
                <div className={style.tableParent}>
                    <table className={style.table}>
                        <tr className={style.tableHeader}>
                            <th>Action Date</th>
                            <th>Action By</th>
                            
                            <th>Action</th>
                            
                        </tr>
                        {
                            actions?.map((action, index) => {
                                return (
                                    <tr key={index}>
                                        
                                        <td>{formatDate(action?.CorrectionDate)}</td>
                                       
                                        <td>{action?.CorrectionBy}</td>
                                        
                                        <td><button className={style.btn} onClick={() => {
                                            dispatch(updateTabData({ ...tabData, Tab: 'viewCorrectiveAction' }))
                                            dispatch(changeId(action._id));
                                        }}>View Action</button></td>
                                       
                                        

                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            </div>

            {
                alert ?
                    <div class={style.alertparent}>
                        <div class={style.alert}>
                            <p class={style.msg}>{popUpData}</p>
                            <div className={style.alertbtns}>
                                <button onClick={alertManager} className={style.btn2}>OK.</button>
                            </div>
                        </div>
                    </div> : null
            }
           


        </>
    )
}

export default ActionsList