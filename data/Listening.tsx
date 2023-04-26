import {useMemo, useEffect, useState} from 'react';
import {useLanyardWS} from 'use-lanyard';
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import {FaSpotify} from "react-icons/fa";

const DiscordStatus = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Does not disturb',
    offline: 'Offline',
};

const StatusColor = {
    online: 'bg-online',
    idle: 'bg-idle',
    dnd: 'bg-dnd',
    offline: 'bg-offline',
};

const getAssetUrl = (appId: string, asset: string) =>
    asset.startsWith('mp:external')
        ? `https://media.discordapp.net/${asset.replace('mp:', '')}`
        : `https://cdn.discordapp.com/app-assets/${appId}/${asset}.png`;

function Listening() {
    const presence = useLanyardWS('440239378158059532');

    const [elapsedTime, setElapsedTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [elapsedSongTime, setElapsedSongTime] = useState('00:00');
    const [endSongTime, setEndSongTime] = useState('00:00');

    const getCurrentTime = () => {
        const date = new Date();
        return date.getTime();
    }

    const user = useMemo(() => {
        return presence?.discord_user;
    }, [presence]);

    const status = useMemo(() => {
        return presence && DiscordStatus[presence.discord_status as keyof typeof DiscordStatus];
    }, [presence]);

    const activity = useMemo(() => {
        return presence?.activities?.find((x: { type: number; }) => x.type === 0);
    }, [presence]);

    useEffect(() => {
        const interval = setInterval(() => {
            // @ts-ignore
            const elapsed = Date.now() - activity?.timestamps?.start;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            // @ts-ignore
            setElapsedTime((days > 0 ? `${days}d ` : '') + (hours % 24 > 0 ? `${hours % 24}h ` : '') + (minutes % 60 > 0 ? `${minutes % 60}m ` : '') + (seconds % 60 > 0 ? `${seconds % 60}s` : ''));

        }, 1000);
        return () => clearInterval(interval);
    }, [activity]);

    useEffect(() => {
        const interval = setInterval(() => {
            // @ts-ignore
            const total = presence?.spotify?.timestamps?.end - presence?.spotify?.timestamps?.start;
            // @ts-ignore
            const progress = 100 - (100 * (presence?.spotify?.timestamps?.end - getCurrentTime()) / total);
            // @ts-ignore
            setProgress(progress.toFixed(2));
            if (progress >= 100) {
                setProgress(100);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [presence]);

    useEffect(() => {
        // Time format mm:ss
        const interval = setInterval(() => {
            // @ts-ignore

            const elapsed = getCurrentTime() - presence?.spotify?.timestamps?.start;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);

            // @ts-ignore
            setElapsedSongTime((minutes > 0 ? `${minutes < 10 ? `0${minutes}` : minutes}:` : '00:') + (seconds % 60 > 0 ? `${seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}` : '00'));
        }, 1000);
        return () => clearInterval(interval);
    }, [presence]);

    useEffect(() => {
        const start = presence?.spotify?.timestamps?.start;
        const end = presence?.spotify?.timestamps?.end;
        // @ts-ignore
        const time = Math.floor((end - start) / 1000);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const formatStr = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        setEndSongTime(formatStr);
    }, [presence]);

    // @ts-ignore
    return (
        <section className="flex flex-1 mb-4">
            <div className="flex flex-col w-full">
                {presence ? (
                    <div
                        className="rounded-lg p-4 w-full max-w-xl bg-zinc-700 dark:bg-black/10 text-white dark:text-black">
                        <div className="flex flex-col items-center sm:flex-row">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="w-28 h-28 rounded-full mb-4 sm:mb-0 sm:mr-4"
                                src={
                                    user!.avatar
                                        ? `https://cdn.discordapp.com/avatars/${user!.id}/${user!.avatar}.gif?size=128`
                                        : `https://cdn.discordapp.com/embed/avatars/${
                                            parseInt(user!.discriminator.slice(-1), 10) % 5
                                        }.png`
                                }
                                alt="User Avatar"
                            />
                            <div>
                                <h4 className="text-xl font-bold text-black leading-6">
                                    {user!.username}
                                    <span className="font-normal text-gray-400 ml-1 text-lg">
                  #{user!.discriminator}
                </span>
                                </h4>
                                <div
                                    className="flex flex-row items-center justify-center text-gray-400 sm:justify-start">
                                    <div
                                        className={`w-4 h-4 rounded-full ${
                                            StatusColor[presence.discord_status as keyof typeof StatusColor]
                                        } mr-2`}
                                    />
                                    <span>{status}</span>
                                </div>
                            </div>
                        </div>
                        {presence.listening_to_spotify && (
                            <div className="mt-4">
                                <h5 className="ml-1  mb-1 text-sm font-bold opacity-70">Listening</h5>
                                <div
                                    className="rounded-lg flex flex-col space-y-4 overflow-hidden p-4 bg-[rgba(0,0,0,.2)]">
                                    <div
                                        className="flex p-3 space-x-4 items-center">
                                        <div className="flex-shrink-0  relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                className="rounded-full  h-20 w-20"
                                                src={`${presence.spotify!.album_art_url}`}
                                                alt={`${presence.spotify!.song} art`}
                                            />
                                            <FaSpotify
                                                className="w-6 h-6  border-2 padding-3 rounded-full bg-black border-green-400 absolute bottom-[-8px] right-[-8px]"/>
                                        </div>
                                        <div className="space-y-px">
                                            <a href={`https://open.spotify.com/track/${presence.spotify!.track_id}`}
                                               target="_blank"
                                               rel="noreferrer"
                                               title="Open on Spotify"
                                               className="cursor-pointer font-semibold text-lg leading-tight hover:underline">
                                                {presence.spotify!.song}
                                            </a>
                                            <h2 className=" text-gray-400 line-clamp-2">
                                                by {presence.spotify!.artist}
                                            </h2>
                                            <h2 className="leading-tight  text-gray-400 line-clamp-2">
                                                {presence.spotify!.album}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="flex  items-center">
                                        <div className="flex-1">
                                            <div className="h-2 bg-gray-300  rounded-full">
                                                <div
                                                    className="h-2 rounded-full boder-black bg-green-500 transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}/>
                                            </div>
                                            <div className="flex items-center text-gray-500 justify-between">
                                                <small className="opacity-50">{elapsedSongTime}</small>
                                                <small className="opacity-50">{endSongTime}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                   
                        
                                    
                                    
                                
                            
                        
                    </div>
                ) : (
                    <section className="flex-1 items-center mb-4">
                        <div
                            className="rounded-lg flex items-center flex-row p-4 overflow-x-hidden bg-zinc-700 dark:bg-black/10 text-black dark:text-white">
                            <AiOutlineLoading3Quarters className="animate-spin mr-2"/>
                            <span className="text-sm opacity-90 text-black dark:text-black">
                    Loading status <span className="text-white animate-pulse">...</span>
                    </span>
                        </div>
                    </section>
                )}
            </div>
        </section>
    );
}

export default Listening;