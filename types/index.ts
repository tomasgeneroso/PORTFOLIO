import { ClassAttributes, JSX, ImgHTMLAttributes } from "react";

export interface Icon {
  size?: number;
  width?: number;
  height?: number;
  [key: string]: any; // Permitir cualquier otra propiedad
}
export type User ={
    name: string;
    surname: string;
    phone: string;
    photo: string;
    aboutMe: string;
    links:{
      Github:string;
      Linkedin:string;
      Gmail:string;
    };
    skills: Skill[];
    projects: Project[];
    experience: Experience[];
    testimonies: Testimonies[];
}
export type UserLinks = {
  userLinks: User["links"];
};
export type UserProps={
  userData: User;
}
interface Project {
  projectName: string;
  enterpriseicono: React.ComponentType<
    React.ImgHTMLAttributes<HTMLImageElement>
  >
  projectImage: React.ReactNode | string;
  date: string;
  description: string;
  technologies: string[];
  link: string;
}
export interface Skill {
  icono: React.ReactNode;
  level: number;
  color: string;
}
export type ContactInfo = {
  Github: string,
  Linkedin: string,
  Gmail:string;
};
export type ContactInfoProps = {
  contactInfo: ContactInfo;
};
export interface RootLayoutProps extends React.PropsWithChildren<{}> {
  userData?: User; // Assuming User is correctly defined
}
type Testimonies = {
  author: string;
  photo: string;
  testimonial: string;
  projectLink: string;
};
export type LogoUrl={
  alt?: string;
  logoURL:string;
}
export interface CustomSvgIconProps {
  svgContent: React.ReactNode; 
  className:  string;
}
export interface IconSvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number; 
  width?: number; 
  height?: number; 
}
export interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
 
}
export type ProjectsCardProps ={ 
  projects: Project[];
 }
 export type Experience = {
  projectName: string;
  enterpriseicono?: ((props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>) => JSX.Element) | string;
  projectImage?: JSX.Element | string;
  date: string;
  description: string;
  technologies: string[];
  link: string;
};