import { useDispatch, useSelector } from "react-redux"
import { getAnalyticsDataRequest } from "./redux/slices/analyticsSlice"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const AnalyticsLayout = () => {

    const data:any = useSelector((state: any) => state || [])

    console.log('Analytics data:', data)

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getAnalyticsDataRequest())
    },[])

  return (
    <div>
      AnalyticsLayout
      <Outlet />
    </div>
  )
}

export default AnalyticsLayout
