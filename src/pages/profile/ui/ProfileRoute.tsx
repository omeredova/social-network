import { useParams } from "@tanstack/react-router";
import { ProfilePage } from "./ProfilePage";

export function ProfileRoute() {
  const { profileId } = useParams({ from: '/profile/$profileId' })
  return <ProfilePage key={profileId} profileId={profileId}/>
}