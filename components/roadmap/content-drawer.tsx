import { useState } from 'react';
import { Box, Button, Flex, Text,} from '@chakra-ui/react';
import { RemoveScroll } from 'react-remove-scroll';
import { RoadmapType } from '../../lib/roadmap';
import RoadmapGroup from '../../pages/[roadmap]/[group]';
import { CheckIcon, CloseIcon, RepeatIcon } from '@chakra-ui/icons';
import { queryGroupElementsById } from '../../lib/renderer/utils';

type ContentDrawerProps = {
  roadmap: RoadmapType;
  groupId: string;
  onClose?: () => void;
};

export function ContentDrawer(props: ContentDrawerProps) {
  const { roadmap, groupId, onClose = () => null } = props;
  // if (!groupId) {
  //   return null;
  // }

  // const isDone = localStorage.getItem(groupId) === 'done';
//data
console.log({groupId})
const defaultGroupData = { done: false, level: 'no_level' }
const groupData = localStorage.getItem(groupId)
const groupDataParsed = groupData ? JSON.parse(groupData) : defaultGroupData
const isDone = groupDataParsed.done === true;
const [level, setLevel] = useState(groupDataParsed.level)


  return (
    <Box zIndex={99999} pos="relative">
      <Box
        onClick={onClose}
        pos="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="black"
        opacity={0.4}
      />
      <RemoveScroll allowPinchZoom>
        <Box
          p="0px 30px 30px"
          position="fixed"
          w={['100%', '60%', '40%']}
          bg="white"
          top={0}
          right={0}
          bottom={0}
          borderLeftWidth={'1px'}
          overflowY="scroll"
        >
          <Flex
            mt="20px"
            justifyContent="space-between"
            alignItems="center"
            zIndex={1}
          >
            {!isDone && (
              <Button
                onClick={() => {
                  groupDataParsed.done = true
                  localStorage.setItem(groupId, JSON.stringify(groupDataParsed));
                  queryGroupElementsById(groupId).forEach((item) =>
                    item?.classList?.add('done')
                  );
                  onClose();
                }}
                colorScheme="green"
                leftIcon={<CheckIcon />}
                size="xs"
                iconSpacing={0}
              >
                <Text
                  as="span"
                  d={['block', 'none', 'none', 'block']}
                  ml="10px"
                >
                  Mark as Done
                </Text>
              </Button>
            )}

            {/* start list */}  


            <select
              value={level}
              onChange={(event) => {
                const newLevel = event.target.value;
                setLevel(newLevel)
                groupDataParsed.level = event.target.value;
                localStorage.setItem(groupId, JSON.stringify(groupDataParsed));
                queryGroupElementsById(groupId).forEach((item) => {
                  item?.classList?.remove(level)
                  item?.classList?.add(newLevel)
                });
                onClose();
              }}
            >
              <option className='no_level' value="no_level">Level</option>
              <option style={{ background: '#A0C1B8' }}className='beginner' value="beginner">Beginner</option>
              <option style={{ background: '#6FDFDF' }}className='intermediate' value="intermediate">Intermediate</option>
              <option style={{ background: 'limegreen' }}className='advanced' value="advanced">Advanced</option>
            </select>
                
            {/* end list */}
            {isDone && (
              <Button
                onClick={() => {
                  groupDataParsed.done = false
                  localStorage.setItem(groupId, JSON.stringify(groupDataParsed));
                  queryGroupElementsById(groupId).forEach((item) =>
                    item?.classList?.remove('done')
                  );
                  onClose();
                }}
                colorScheme="red"
                leftIcon={<RepeatIcon />}
                size="xs"
                iconSpacing={0}
              >
                <Text
                  as="span"
                  d={['block', 'none', 'none', 'block']}
                  ml="10px"
                >
                  Mark as Pending
                </Text>
              </Button>
            )}
            <Button
              onClick={onClose}
              colorScheme="yellow"
              ml="5px"
              leftIcon={<CloseIcon width="8px" />}
              iconSpacing={0}
              size="xs"
            >
              <Text as="span" d={['none', 'none', 'none', 'block']} ml="10px">
                Close
              </Text>
            </Button>
          </Flex>
          <RoadmapGroup isOutlet roadmap={roadmap} group={groupId} />
        </Box>
      </RemoveScroll>
    </Box>
  );
}
