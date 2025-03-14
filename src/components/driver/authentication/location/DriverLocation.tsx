/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import SignupMap from "../map/SingupMap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {toast} from 'sonner' ;
import axiosDriver from '../../../../services/axios/driverAxios'
import { useNavigate } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

import 'mapbox-gl/dist/mapbox-gl.css';


import { useDispatch } from "react-redux";
import { openPendingModal } from "../../../../services/redux/slices/pendingModalSlice";
import Loader from "../../../shimmer/Loader";

function DriverLocation() {

    const dispatch = useDispatch()

    const navigate = useNavigate();

    const [isGeolocationActive, setIsGeolocationActive] = useState(false);
    const [marker] = useState(false);

    const [, setlocation] = useState(false);
    const [longitude, setlongitude] = useState(68.7);
    const [latitude, setlatitude] = useState(8.4);
    const [load,setLoad]=useState(false)
    const handleGeolocation = (lat: number, lng: number, status: any) => {
        setlocation(status);
        setlongitude(lng);
        setlatitude(lat);
        formik.setFieldValue("latitude", lat);
        formik.setFieldValue("longitude", lng);
    };

    const formik = useFormik({
        initialValues: {
            latitude: latitude,
            longitude: longitude,
        },
        validationSchema: Yup.object({
            latitude: Yup.number()
                .min(8.4, "Choose a valid location in India")
                .max(37.6, "Choose a valid location in India"),
            longitude: Yup.number()
                .min(68.7, "Choose a valid location in India")
                .max(97.25, "Choose a valid location in India"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {        
                setLoad(true)        
                const driverId = localStorage.getItem("driverId");
                const { data } = await axiosDriver().post(`location?driverId=${driverId}`, values, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });                
                if (data.message === "Success") {
                    setLoad(false)
                    navigate("/driver/login");
                    localStorage.removeItem('driverId')
                    dispatch(openPendingModal())
                } else {
                    toast.error(data.message);
                }
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        toast.error(formik.errors.longitude);
    }, [formik.errors.longitude]);

    return (
        <>
            <div className="driver-registration-container h-screen flex justify-center items-center">
                <div className="w-5/6 md:w-4/6 md:h-4/5  md:flex justify-center bg-white rounded-3xl my-5 drop-shadow-2xl">
                    <div className="relative overflow-hidden h-full sm:pl-14 md:pl-16 md:w-1/2 i justify-around items-center mb-3 md:m-0">
                        <div className="flex w-full justify-center pt-10 items-center">
                            <h1 className="text-blue-800 font-bold text-4xl mx-7 md:mx-0 md:mt-2  md:text-6xl user-signup-title">
                                Choose your Location!
                            </h1>
                        </div>
                        <h1 className="text-blue-800  text-sm mt-3 mx-7 md:mx-0  md:text-sm md:max-w-sm md:mt-3 user-signup-title">
                            Select your preferred location to enhance navigation and provide efficient service to your
                            passengers.{" "}
                        </h1>
                        <div className="hidden  md:flex md:items-center justify-center">
                            {load ? <Loader/> : (
                                <img
                                    style={{ height: "300px", width: "auto" }}
                                    src="/images/location.jpg"
                                />

                            )}
                        </div>
                    </div>
                    <div className="flex md:w-1/2 justify-center pb-10 md:py-10 px-2 md:px-0 items-center">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="user-signup-form driver-signup-map-form w-full h-full md:w-96 md:h-96  rounded-md drop-shadow-xl">
                                <div className="mb-4 mt-4">
                                    <SignupMap
                                        handleGeolocation={handleGeolocation}
                                        isGeolocationActive={isGeolocationActive}
                                        selectMarker={marker}
                                    />
                                </div>
                            </div>
                            <div className="flex mt-6 justify-evenly ">
                                <div className="w-1/2 py-2.5 px-3 mr-1 flex justify-center items-center  bg-blue-800 rounded-2xl">
                                    <ExploreIcon style={{ color: "white" }} />
                                    <button
                                        onClick={() => setIsGeolocationActive(!isGeolocationActive)}
                                        type="button"
                                        className=" w-full text-sm  text-golden font-normal "
                                    >
                                        Get Current Location
                                    </button>
                                </div>

                                <div className="w-1/2 ml-1 px-3 flex justify-center items-center bg-blue-800  rounded-2xl">
                                    <WhereToVoteIcon style={{ color: "white" }} />
                                    <button 
                                    type="submit" 
                                    className=" w-full text-sm  text-golden font-normal ">
                                        Choose this location
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DriverLocation;