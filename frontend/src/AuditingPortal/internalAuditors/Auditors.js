import style from './Auditors.module.css'
import Search from '../../assets/images/employees/Search.svg'
import add from '../../assets/images/employees/Application Add.svg'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from "axios";
import profile from '../../assets/images/addEmployee/prof.svg'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { updateTabData } from '../../redux/slices/tabSlice'
import { changeId } from '../../redux/slices/idToProcessSlice'
import { setLoading } from '../../redux/slices/loading'
import Swal from 'sweetalert2'


function Auditors() {

    const [auditorsList, setAuditorsList] = useState(null);
    const [popUpData, setPopUpData] = useState(null);
    const [showBox, setShowBox] = useState(false);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(8);
    const [allDataArr, setAllDataArr] = useState(null);
    const [sendEmail, setSendEmail] = useState(false);

    const userToken = Cookies.get('userToken');
    const tabData = useSelector(state => state.tab);
    const dispatch = useDispatch();


    const handleDownloadImage = async (imageURL) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.get('/download-image', {
                params: {
                    url: imageURL,
                },
                responseType: 'blob', headers: { Authorization: `Bearer ${userToken}` }  // Specify the response type as 'blob' to handle binary data
            });

            // Create a Blob object from the response data
            const blob = new Blob([response.data]);

            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            // Set the download attribute and suggested filename for the downloaded image
            link.download = `file-homage${imageURL.substring(imageURL.lastIndexOf('.'))}`;
            // Append the anchor element to the document body and click it to trigger the download
            document.body.appendChild(link);
            dispatch(setLoading(false));
            link.click();
            // Clean up by removing the temporary anchor element
            document.body.removeChild(link);
        } catch (error) {
            dispatch(setLoading(false))
            Swal.fire({
                icon : 'error',
                title : 'OOps..',
                text : 'Something went wrong, Try Again!'
            })
        }

    };


    useEffect(() => {
        dispatch(setLoading(true))
        axios.get("/readAuditor", { headers: { Authorization: `Bearer ${userToken}` } }).then((response) => {
            setAllDataArr(response.data.data);
            setAuditorsList(response.data.data.slice(startIndex, endIndex));
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

        setAuditorsList(allDataArr?.slice(startIndex, endIndex))
    }, [startIndex, endIndex])

    const search = (event) => {
        if (event.target.value !== "") {
            setAuditorsList(allDataArr.filter((obj) =>
                obj.AuditorCode.includes(event.target.value) || obj.Name.includes(event.target.value)
            ));
        } else {
            setAuditorsList(allDataArr?.slice(startIndex, endIndex))
        }
    }





    const navigate = useNavigate()
    return (
        <>

            <div className={style.subparent}>
                <div className={style.searchbar}>
                    <div className={style.sec1}>
                        <img src={Search} alt="" />
                        <input onChange={search} type="text" placeholder='Search Auditor by name, id' />
                    </div>
                    {tabData?.Creation && (

                        <div onClick={() => {
                            dispatch(updateTabData({...tabData, Tab : 'addAuditors'}))
                        }} className={style.sec2} >
                            <img src={add} alt="" />
                            <p>Add Auditor</p>
                        </div>
                    )}
                </div>
                <div className={style.tableParent2}>

                    {!auditorsList || auditorsList?.length === 0 ? (
                        <div className='w-100 d-flex align-items-center justify-content-center'>
                            <p className='text-center'>No any Records Available here.</p>
                        </div>
                    ) : (

                        <table className={style.table}>
                            <tr className={style.headers}>
                                <td>Auditor Code</td>
                                <td>Name</td>
                                <td>Designation</td>
                                <td>Age</td>
                                <td>Phone No</td>
                                <td>Email Address</td>
                                {/* <td>Password</td> */}
                                <td>Experience</td>
                                <td>Skills</td>
                                <td>Education</td>
                                <td>Department</td>
                                <td>Documents</td>
                                <td>Approved Auditor</td>
                                <td>Role</td>
                                <td>Action</td>


                            </tr>
                            {
                                auditorsList?.map((auditor, i) => {
                                    return (
                                        <tr className={style.tablebody} key={i}>
                                            <td >
                                                <p>{auditor.UserId}</p>
                                            </td>
                                            <td><div style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                overflow: "hidden",
                                                backgroundImage: `url(${profile})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}>
                                                <img style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }} onError={(e) => {
                                                    e.target.style.display = 'none'; // Hide the img tag on error
                                                }} src={auditor.AuditorImage || profile} alt={profile} />

                                            </div>{auditor.Name}</td>
                                            <td>{auditor.Designation}</td>
                                            <td>{auditor.Age}</td>
                                            <td>{auditor.PhoneNumber}</td>
                                            <td>{auditor.Email}</td>
                                            {/* <td>{auditor.Password}</td> */}
                                            <td>{auditor.Experience}</td>
                                            <td>{auditor.Skills}</td>
                                            <td>{auditor.Education}</td>
                                            <td>{auditor.Department.DepartmentName}</td>
                                            <td >
                                                <button onClick={() => {
                                                    handleDownloadImage(auditor.AuditorDocument)
                                                }} style={{
                                                    cursor: "pointer"
                                                }} className={`${style.download} btn btn-outline-primary`}>Download</button>
                                            </td>
                                            <td >
                                                <button onClick={() => {
                                                    handleDownloadImage(auditor.ApprovedAuditorLetter)
                                                }} style={{
                                                    cursor: "pointer"
                                                }} className={`px-2 py-1 btn btn-outline-primary`}>Download</button>
                                            </td>
                                            <td>{auditor.Role}</td>
                                            <td >
                                                <button onClick={() => {
                                                    dispatch(updateTabData({...tabData, Tab : 'assignTabsToInternalAuditor'}));
                                                    dispatch(changeId(auditor._id))
                                                }} style={{
                                                    cursor: "pointer",
                                                    width: '130px'
                                                }} className={`px-2 py-1 btn btn-outline-danger`}>Assign Tabs</button>
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
            {
                showBox && (

                    <div class={style.alertparent}>
                        <div class={style.alert}>

                            <p class={style.msg}>{popUpData}</p>

                            <div className={style.alertbtns}>

                                <button onClick={() => {
                                    setShowBox(false);

                                }} className={style.btn2}>OK</button>

                            </div>
                        </div>
                    </div>
                )
            }
            {
                sendEmail && (
                    <div class={style.alertparent}>
                        <div class={style.alert}>
                            <form onSubmit={(e) => {

                            }}>
                                <span className='d-flex email flex-row'>
                                    <p><b>To : </b></p><p className='ms-4 bg-light px-3' style={{
                                        borderRadius: '30px'
                                    }}>owner@gmail.com</p>

                                </span>
                                <input type='text' placeholder='Subject' />

                                <textarea name="Reason" id="" cols="30" rows="10" placeholder='Comment here' required />
                                <div className={`${style.alertbtns} mt-3 d-flex justify-content-center `}>
                                    <button type='submit' className={style.btn1}>Send</button>
                                    <button onClick={() => {
                                        setSendEmail(false);
                                    }} className={style.btn2}>Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }


        </>
    )
}

export default Auditors
