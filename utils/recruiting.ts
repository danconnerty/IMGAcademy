import { Player } from '../types';

export const isRecruitVisibleOutsideRecruitingPage = (player: Player): boolean => {
  if (player.type !== 'recruit' || player.inviteStatus === 'sent') return false;
  return player.recruitCommitment === 'offered' || player.recruitCommitment === 'signed';
};

export const getRecruitStatusSignifier = (player: Player) => {
  if (player.type !== 'recruit') return null;

  if (player.recruitCommitment === 'signed') {
    return { label: 'Signed', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  }

  if (player.recruitCommitment === 'offered') {
    return { label: 'Offered', className: 'bg-orange-100 text-orange-700 border-orange-200' };
  }

  return null;
};
