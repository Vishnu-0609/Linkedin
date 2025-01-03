import ProfileHeader from '../components/Profile/ProfileHeader';
import About from '../components/Profile/About';
import Experience from '../components/Profile/Experiencs';
import Skills from '../components/Profile/Skills';
import Analytics from '../components/Profile/Analytics';
import Activity from '../components/Profile/Activity';
import Educations from '../components/Profile/Educations';
import { Routes, Route, useParams } from 'react-router-dom';
import Notfound from '../components/Notfound';
import { MoveLeft, Plus, Trash2, Users } from 'lucide-react';
import Feed from '../components/Dashboard/Feed';
import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import EditIntroForm from '../Forms/EditIntroForm';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import useApi from '../hook/useApi';
import Loader from '../components/Loaders/Loader';

function Profile() {
  const { user } = useSelector(state => state.authReducer);
  const { apiAction } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      fetchData();
      getEducationsData();
      getExperiencesData();
      getSkills();
      setIsLoading(false);
    }
  }, [user])

  const fetchData = async () => {
    const { success, data } = await apiAction({
      url: `/api/v1/post/listAllPost/${id}`,
      method: "GET",
    });

    if (success) {
      setPosts(data);
    }
  };

  const getEducationsData = async () => {
    const { success, data } = await apiAction({
      url: `/api/v1/profile/education/${id}`,
      method: "GET",
    });

    if (success) {
      setEducations(data);
    }
  };

  const getExperiencesData = async () => {
    const { success, data } = await apiAction({
      url: `/api/v1/profile/experience/${id}`,
      method: "GET",
    });

    if (success) {
      setExperiences(data);
    }
  };

  const getSkills = async () => {
    const { success, data } = await apiAction({
      url: `/api/v1/profile/skill/getAllSkill/${id}`,
      method: "GET",
    });

    if (success) {
      setSkills(data);
    }
  };

  if (isLoading)
    return <Loader />;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl max-h-[90vh] overflow-y-scroll someElement mx-auto px-4 pb-2">
        <Routes>
          <Route path="/" element={<ProfilePage user={user} posts={posts.length > 3 ? posts.slice(0, 3) : posts || []} educations={educations} experiences={experiences} skills={skills.length > 3 ? skills.slice(0, 3) : skills || []} />} />
          <Route path="/all-posts" element={<ActivityPage posts={posts} />} />
          <Route path="/all-skills" element={<SkillPage skills={skills} />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </div>
  );
}

const ProfilePage = ({ user, posts, educations, experiences, skills }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ProfileHeader setIsModalOpen={setIsModalOpen} user={user} />
      <Analytics views={user?.views || 0} />
      <About about={user?.about} />
      <Activity followers={user?.followers?.length} posts={posts} />
      <Experience experiences={experiences} />
      <Educations educations={educations} />
      <Skills skills={skills} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit intro"
      >
        <EditIntroForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  )
}

const ActivityPage = ({ posts }) => {
  return (
    <div className="bg-white rounded-lg shadow pt-6 mt-4">
      <div className='flex items-center gap-2 px-6 mb-4'>
        <div onClick={handleBack} className='w-10 h-10 hover:bg-[#866f55] hover:bg-opacity-10 rounded-full flex justify-center items-center cursor-pointer'>
          <MoveLeft />
        </div>
        <h2 className="text-xl font-bold text-gray-900">All Posts</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 pb-4">
        <Feed posts={posts} />
      </div>
    </div>
  )
}

const SkillPage = ({skills}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow pt-6 mt-4">
      <div className='flex items-center gap-2 px-6 mb-4'>
        <div onClick={handleBack} className='w-10 h-10 hover:bg-[#866f55] hover:bg-opacity-10 rounded-full flex justify-center items-center cursor-pointer'>
          <MoveLeft />
        </div>
        <div className="flex justify-between items-center flex-grow">
          <h2 className="text-xl font-bold text-gray-900">Skills</h2>
          <button onClick={() => setIsOpen(prev => !prev)} className="p-2 hover:bg-[#866f55] hover:bg-opacity-10 rounded-full  "><Plus width={25} height={25} /></button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 pb-4">
        {skills && skills.length > 0 && skills.map((skill, index) => (
          <div key={index} className={`flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg border-b ${skills.length - 1 === index ? 'border-b-0' : ''}`}>
            <div className='flex flex-col gap-4'>
              <span className="text-gray-800 font-semibold text-lg">{skill.name}</span>
              {
                skill?.references && skill.references.length > 0 && skill.references.map((ref, index) => (
                  <div key={index} className='flex gap-2 items-center'>
                    <img src={ref?.logo} alt={ref?.name} className="w-8 h-8 object-cover" />
                    <span className="text-md text-gray-700">{skill.name + " at " + ref?.name}</span>
                  </div>
                ))
              }
              {
                skill.endorsedBy && skill.endorsedBy.length > 0 && (
                  <div className='flex gap-2 items-center'>
                    <Users className='w-6 h-6 text-gray-600' />
                    <span className="text-sm font-semibold text-gray-600">{skill.endorsedBy.length} endorsement</span>
                  </div>
                )
              }
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <div className="flex items-center gap-2 text-gray-500">
                <button className='p-2 hover:bg-[#866f55] hover:bg-opacity-10 rounded-full'><Trash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title='Add skill'>
        Add Skill
      </Modal>
    </div>
  )
}

ActivityPage.propTypes = {
  posts: PropTypes.array,
};

ProfilePage.propTypes = {
  user: PropTypes.object,
  posts: PropTypes.array,
  educations: PropTypes.array,
  experiences: PropTypes.array,
  skills: PropTypes.array
};

const handleBack = () => {
  window.history.back();
};

SkillPage.propTypes = {
  skills: PropTypes.array,
};

export default Profile;