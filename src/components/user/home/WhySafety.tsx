
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
// import { SupportIcon } from "@heroicons/react/24/solid";

const WhySafely = () => {
    return (
        <>
            <div className="bg-white container mx-auto pt-10 px-6 pb-7">
                <div className="">
                    <h1 className="text-4xl font-bold text-blue-800">Why Safely?</h1>
                </div>

                <div className="container w-full h-fit md:flex md:justify-between grid grid-rows-1 gap-5 py-10 ">
                    <div className="mx-auto">
                        <Card
                            shadow={false}
                            className="relative grid h-[15rem] w-full max-w-[25rem] justify-center overflow-hidden text-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="absolute inset-0 m-0 h-full w-full rounded-none bg-[url('https://img.freepik.com/free-photo/front-view-female-builder-yellow-helmet-black-shirt-showing-heart-sign-white-wall_140725-35157.jpg?w=1060&t=st=1693977063~exp=1693977663~hmac=da2049a8a99ae6b819355f8aacb589bc4ec6f17f12c4c72e0efaad688a85706e')] bg-cover bg-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <div className="bg-black opacity-50 absolute inset-0 h-full w-full " />
                            </CardHeader>

                            <CardBody className="relative pt-6 px-6 md:px-7"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <div className="text-5xl mb-2">
                                    <ShieldCheckIcon className="text-white w-12 h-12" />
                                </div>
                                <Typography variant="h4" className="mb-2 font-bold text-golden" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    Safety First
                                </Typography>
                                <Typography variant="paragraph" className="mb-4 text-gray-300 text-sm font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    At safely, we prioritize your safety above all else. Our women-only cab booking service
                                    is designed to provide you with a secure and comfortable travel experience.
                                </Typography>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="mx-auto">
                        <Card
                            shadow={false}
                            className="relative grid h-[15rem] w-full max-w-[25rem] justify-center overflow-hidden text-center" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="absolute inset-0 m-0 h-full w-full rounded-none bg-[url('https://img.freepik.com/free-photo/businesswoman-car_23-2148002180.jpg?w=1060&t=st=1693977505~exp=1693978105~hmac=999590df76c04afa58dda33a224897c684eb3a7dfc05c67b89ebc3769a451385')] bg-cover bg-center" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <div className="bg-black opacity-50 absolute inset-0 h-full w-full " />
                            </CardHeader>

                            <CardBody className="relative pt-6 px-6 md:px-7"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <div className="text-5xl mb-2">
                                    <CalendarDaysIcon className="text-white w-12 h-12" />
                                </div>
                                <Typography variant="h4" className="mb-2 font-bold text-golden" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    Unmatched Convenience
                                </Typography>
                                <Typography variant="paragraph" className="mb-4 text-gray-300 text-sm font-normal"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    Experience the ultimate convenience with safely. All our drivers undergo strict
                                    background checks. We offer a range of services tailored to meet the diverse needs of
                                    modern women on the move.
                                </Typography>
                            </CardBody>
                        </Card>
                    </div>
                    <div className="mx-auto">
                        <Card
                            shadow={false}
                            className="relative grid h-[15rem] w-full max-w-[25rem]  justify-center overflow-hidden text-center" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                        >
                            <CardHeader
                                floated={false}
                                shadow={false}
                                color="transparent"
                                className="absolute inset-0 m-0 h-full w-full rounded-none bg-[url('https://img.freepik.com/free-photo/portrait-woman-customer-service-worker_144627-37948.jpg?w=996&t=st=1693977690~exp=1693978290~hmac=225c3442302eee2ef70bd2c9d5ee4823e82b955fef5b0a95b117d6b4078e63c6')] bg-cover bg-center"  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                            >
                                <div className="bg-black opacity-50 absolute inset-0 h-full w-full " />
                            </CardHeader>

                            <CardBody className="relative pt-6 px-6 md:px-7" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                <div className="text-5xl mb-2">
                                    {/* <SupportIcon className="text-white w-12 h-12" /> */}
                                </div>
                                <Typography variant="h4" className="mb-2 font-bold text-golden" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    Dedicated Assistance
                                </Typography>
                                <Typography variant="paragraph" className="mb-4 text-gray-300 text-sm font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                    At safely, we are committed to providing exceptional customer support. Our dedicated
                                    team is available round-the-clock to assist you with any queries or concerns you may
                                    have.
                                </Typography>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WhySafely;