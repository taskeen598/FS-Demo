import style from './Trainings.module.css'
import Search from '../../assets/images/employees/Search.svg'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { updateTabData } from '../../redux/slices/tabSlice'
import { changeId } from '../../redux/slices/idToProcessSlice'
import { setLoading } from '../../redux/slices/loading'
import Swal from 'sweetalert2'


function Trainings() {
    const [assignedtrainings, setAssignedTrainings] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(8);
    const [allDataArr, setAllDataArr] = useState(null);
    const userToken = Cookies.get('userToken');
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(setLoading(true))
        axios.get("/readMonthlyPlan", { headers: { Authorization: `Bearer ${userToken}` } }).then((Response) => {
            const plannedTrainingsList = Response.data.data;
            setAllDataArr(plannedTrainingsList.filter((training) => training.Assigned === true));
            setAssignedTrainings(plannedTrainingsList.filter((training) => training.Assigned === true).slice(startIndex, endIndex));
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

        setAssignedTrainings(allDataArr?.slice(startIndex, endIndex))
    }, [startIndex, endIndex])

    const search = (event) => {
        if (event.target.value !== "") {
            console.log(event.target.value);

            const searchedList = allDataArr?.filter((obj) =>

                obj.Training[0].TrainingName.includes(event.target.value)
            )
            console.log(searchedList);
            setAssignedTrainings(searchedList);
        } else {
            setAssignedTrainings(allDataArr?.slice(startIndex, endIndex))
        }
    }


    return (

        <div className={style.subparent} >
            
            <div className={style.searchbar} >
                <div className={style.sec1}>
                    <img src={Search} alt="" />
                    <input onChange={search} type="text" placeholder='Search Training by name' />
                </div>
            </div>
            <div className={style.tableParent}>
                {!assignedtrainings || assignedtrainings?.length === 0 ? (
                    <div className='w-100 d-flex align-items-center justify-content-center'>
                        <p className='text-center'>No any Records Available here.</p>
                    </div>
                ) : (


                    <table className={style.table}>
                        <tr className={style.headers}>
                            <td>Training Name</td>
                            <td>Venue</td>
                            <td>Duration</td>
                            <td>Month</td>
                            <td>Time</td>
                            <td>Action</td>
                        </tr>
                        {
                            assignedtrainings?.map((assignedTraining, i) => {
                                return (
                                    <tr className={style.tablebody} key={i}>
                                        <td className={style.textStyle1}>{assignedTraining.Training.TrainingName}</td>
                                        <td className={style.textStyle2}>{assignedTraining.Venue}</td>
                                        <td className={style.textStyle3}>{assignedTraining.Duration}</td>
                                        <td className={style.textStyle3}>{assignedTraining.Month}</td>
                                        <td className={style.textStyle3}>{assignedTraining.Time}</td>
                                        <td ><button onClick={() => {
                                            dispatch(updateTabData({...tabData, Tab : 'assignedTrainingInfo'}))
                                            dispatch(changeId(assignedTraining._id))
                                           
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

export default Trainings
