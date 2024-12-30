import BannerCard from "../components/BannerCard"
import CreatePost from "../components/Dashboard/CreatePost"
import Feed from "../components/Dashboard/Feed"
import DashboardLayout from "../components/layouts/DashboardLayout" 

function Groupdetails() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl max-h-[90vh] md:overflow-y-scroll someElement mx-auto">
        <BannerCard />
        <CreatePost />
        <div>
          <h1 className="text-md mb-4 px-4 py-2 rounded-full bg-[#01754f] text-white w-fit font-semibold">Group Posts</h1>
          <Feed />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout()(Groupdetails)
