import React from 'react';
import { catchErrors } from '../utils';
import { getTopTracks } from '../spotify';
import { useState, useEffect } from 'react';
import { Loader, SectionWrapper, TrackList, TimeRangeButtons } from '../components';

const TopTracks = () => {
    const [topTracks, setTopTracks] = useState(null);
    const [activeRange, setActiveRange] = useState('short');

    // useEffect hook with async await to get profile data and update profile state
    useEffect(() => {
        const fetchData = async () => {
            const userTopTracks = await getTopTracks(`${activeRange}_term`);
            setTopTracks(userTopTracks.data);
        };

        catchErrors(fetchData());
    }, [activeRange]);

    return(
        <main>
            {topTracks ? (
                <SectionWrapper title="Top Tracks" breadcrumb="true">
                    <TimeRangeButtons activeRange={activeRange} setActiveRange={setActiveRange} />
                    <TrackList tracks={topTracks.items}/>
                </SectionWrapper>
            ) : (
                <Loader/>
            )}
        </main>
    );
}

export default TopTracks;