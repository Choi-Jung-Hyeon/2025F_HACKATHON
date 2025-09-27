import { getProjects, Project } from '@/services/ProjectListService';
import Link from 'next/link';
import React from 'react';

const Sidebar = async () => {
  const projects: Project[] = await getProjects()
  console.log(projects)
  return (
    <aside className="hidden md:flex w-64 bg-[#1e1f20] p-4 flex-col">
      <nav className="flex-grow">
        <p className="text-sm text-gray-400 mb-4 px-2">최근</p>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                key={project.id} 
                href={`/project`}
              >
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;