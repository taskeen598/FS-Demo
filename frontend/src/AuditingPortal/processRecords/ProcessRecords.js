
import style from './ProcessRecords.module.css'
import Search from '../../assets/images/employees/Search.svg'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { updateTabData } from '../../redux/slices/tabSlice';
import { changeId } from '../../redux/slices/idToProcessSlice';
import { setLoading } from '../../redux/slices/loading';
import Swal from 'sweetalert2';


function ProcessRecords() {
    
   const [planProcesses, setPlanProcesses] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(8);
    const [allDataArr, setAllDataArr] = useState(null);

    const userToken = Cookies.get('userToken');
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true))
        axios.get("/readMonthlyAuditPlan", { headers: { Authorization: `Bearer ${userToken}` } }).then((Response) => {
            setAllDataArr(Response.data.data);
            setPlanProcesses(Response.data.data.slice(startIndex, endIndex));
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

        setPlanProcesses(allDataArr?.slice(startIndex, endIndex))
    }, [startIndex, endIndex])

    const search = (event) => {
        if (event.target.value !== "") {
            console.log(event.target.value);

            const searchedList = allDataArr?.filter((obj) =>

                obj.ProcessName.includes(event.target.value)
            )
            console.log(searchedList);
            setPlanProcesses(searchedList);
        } else {
            setPlanProcesses(allDataArr?.slice(startIndex, endIndex))
        }
    }


    return (

        <div className={style.subparent} >
            {/* <ProfileUser path='/hr/profile' /> */}
            <div className={style.searchbar} >
                <div className={style.sec1}>
                    <img src={Search} alt="" />
                    <input onChange={search} type="text" placeholder='Search Process by name' />
                </div>
            </div>
            <div className={style.tableParent}>
                {!planProcesses || planProcesses?.length === 0 ? (
                    <div className='w-100 d-flex align-items-center justify-content-center'>
                        <p className='text-center'>No any Records Available here.</p>
                    </div>
                ) : (


                    <table className={style.table}>
                        <tr className={style.headers}>
                            <td>Process ID</td>
                            <td>Process Name</td>
                            <td>Risk assesment</td>
                            <td>Year</td>
                            <td>Month</td>
                            <td>Date</td>
                            <td>Action</td>
                        </tr>
                        {
                            planProcesses?.map((plan, i) => {
                                return (
                                    <tr className={style.tablebody} key={i}>
                                        <td ><p style={{
                                            backgroundColor: "#f0f5f0",
                                            padding: "2px 5px",
                                            borderRadius: "10px",
                                            fontFamily: "Inter",
                                            fontSize: "12px",
                                            fontStyle: "normal",
                                            fontWeight: "400",
                                            lineHeight: "20px",
                                        }}>{plan?.ProcessOwner?.ProcessCode}</p></td>
                                        <td className={style.textStyle1}>{plan?.ProcessOwner?.ProcessName}</td>
                                       
                                        <td > <div className={`text-center ${style.greenStatus} `}><p>{plan?.ProcessOwner?.ProcessRiskAssessment}</p></div></td>
                                        <td className={style.textStyle3}> {plan?.Year}</td>
                                        <td className={style.textStyle3}>{plan?.Month}</td>
                                        <td className={style.textStyle3}>{plan?.Date}</td>
                                        <td ><button onClick={() => {
                                            dispatch(updateTabData({...tabData, Tab : 'processInfo'}))
                                            dispatch(changeId(plan?._id))
                                        }} className={style.viewBtn}>View</button>
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
                {allDataArr?.length > endIndex && (

                    <button onClick={nextPage}>
                        next{'>> '}
                    </button>
                )}
            </div>
        </div>

    )
}

export default ProcessRecords
